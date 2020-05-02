import { IPC } from 'node-ipc'
import { store } from '../redux/store'
import { setConnecting, setConnected, waitForData, setHost } from '../redux/connection/actions'
import { toUTF8Array } from './util'
import { handleMsgData, resetAppState } from './data_handler'



// Client for IPC communication via TCP Sockets
// Custom Protocol Header (Size: 16 byte, Little Endian):
//   [0-1]:  Start bytes, expected: 0x0FF0
//   [1-5]:  Payload size in bytes
//   [6]:    Message type: 0x01: Json in form of {type: string, cbIndex: int, data: any}
//                         0x02: Packed Capnp (CapnpOutput::Frame)
//   [7-15]: Currently not in use

enum Reading {
  HEADER = 0,
  PAYLOAD
}
const HEADERSIZE: number = 16;
const HOST: string = "localhost";
// const HOST: string = "10.42.0.18"

export class IPCClient {
  private ipc = new IPC();
  private cbCounter: number = 0;
  private callbacks: { [cbIndex: number]: Function } = {}; // dict with key = cbIndex and callback function

  private currPayload: Uint8Array;
  private currHeader = new Uint8Array(HEADERSIZE);
  private bytesToRead: number = HEADERSIZE;
  private reading = Reading.HEADER;
  private isReadingPkg = false;
  private waitForData = false;

  constructor() {
    this.ipc.config.id = 'visu_client';
    this.ipc.config.silent = true;
    this.ipc.config.retry = 2000; // time between reconnects in [ms]
    this.ipc.config.rawBuffer = true;
    this.ipc.config.encoding = "hex";
    this.ipc.config.networkHost = HOST;
    this.ipc.config.networkPort = 8999;
    this.callbacks = {};

    this.start();
  }

  private start() {
    store.dispatch(setConnecting());
    store.dispatch(setHost(HOST));

    console.log("## start listening for server connections #");

    this.ipc.connectToNet('server', () => {
      this.ipc.of.server.on('connect', () => {
        console.log("## connected to server ##");
        store.dispatch(waitForData());
        this.waitForData = true;
      });

      this.ipc.of.server.on('disconnect', () => {
        // Retry connecting
        store.dispatch(setConnecting());
        resetAppState();
        this.bytesToRead = HEADERSIZE;
        this.reading = Reading.HEADER;
        this.waitForData = false;
        console.log('## disconnected from server ##');
      });

      this.ipc.of.server.on('data', (data: any) => {
        let currReadPos: number = 0; // current position of reading bytes of this package
        if (this.isReadingPkg) {
          // If this happens a lot, the data reading is probably blocked by something. async for the help!
          console.warn("Still processing previous Message, dropping this package. Trying to read header again");
          this.readHeader();
          return;
        }
        this.isReadingPkg = true; // kind of a lock to prevent multiple message processing at the same time
        
        while (currReadPos != data.length) {
          if (currReadPos > data.length) {
            console.warn("This should not happen. We have seen more bytes then the pkg length. Trying to read header again.");
            this.readHeader();
            break;
          }

          const pkgBytesLeft: number = data.length - currReadPos;

          // In case the message did not fit in one package, we nee to read the remaining bytes from the next packages
          const readNextFrame = Math.max(0, this.bytesToRead - pkgBytesLeft);
          const readDataNow = this.bytesToRead - readNextFrame;

          // Read header from data
          const dataStart = currReadPos;
          const dataEnd = currReadPos + readDataNow;
          if (this.reading == Reading.HEADER) {
            const offset = HEADERSIZE - this.bytesToRead;
            this.currHeader.set(data.slice(dataStart, dataEnd), offset);
          }
          else if (this.reading == Reading.PAYLOAD) {
            // In case a message was not finished with the previous package, we need to account for the offset
            // Note: .slice() include the start idx, but not the end idx
            const offset = this.currPayload.length - this.bytesToRead;
            this.currPayload.set(data.slice(dataStart, dataEnd), offset);
          }
          currReadPos = dataEnd;

          // In case we need to read some bytes from the next frame
          this.bytesToRead = readNextFrame;

          // In case either header or payload is done reading
          if (this.bytesToRead == 0) {
            if (this.reading == Reading.HEADER) {
              if (this.currHeader[0] != 0x0F && this.currHeader[1] != 0xF0) {
                console.warn("Wrong msg start bytes Drop Package and trying to read Header in next Package.");
                this.readHeader();
                break;
              }
              else {
                this.bytesToRead = (this.currHeader[2] << 24) + (this.currHeader[3] << 16) + (this.currHeader[4] << 8) + this.currHeader[5];
                if (this.bytesToRead < 0) {
                  console.warn("Something went wrong, Payload size negative. Trying to read header again")
                  this.readHeader();
                  break;
                }
                this.currPayload = new Uint8Array(this.bytesToRead);
                this.reading = Reading.PAYLOAD;
                // console.log("Payload Size [Byte]: " + this.currPayload.length);
              }
            }
            else if (this.reading == Reading.PAYLOAD) {
              if (this.waitForData) {
                console.log("## recived well formated data from server ##");
                this.waitForData = false;
                store.dispatch(setConnected());
              }

              this.readHeader();
              // this.currPayload and this.currHeader should be filled correctly. Lets read the message
              const payload = this.currPayload.slice(); // copy since handleMsgData is a async function
              const msgType: number = this.currHeader[6];
              handleMsgData(msgType, payload, this.callbacks);
            }
          }
        }
        this.isReadingPkg = false;
      });
    });
  }

  private readHeader() {
    this.bytesToRead = HEADERSIZE;
    this.reading = Reading.HEADER;
  }

  public async sendMessage(type: string, msg: any = "", cb: Function = null) {
    if (store.getState().connection.connected) {
      let cbIndex = -1;
      if (cb !== null) {
        cbIndex = this.cbCounter++;
        this.callbacks[cbIndex] = cb;
      }
      const jsonMsg: string = JSON.stringify({
        "type": "client." + type,
        "data": msg,
        "cbIndex": cbIndex
      }) + "\n"; // Server uses \n to determine end of message!

      this.ipc.of.server.emit(toUTF8Array(jsonMsg));
    }
    else {
      console.warn("No Server connection, sending message failed");
    }

    if (this.cbCounter > 500000) {
      this.cbCounter = 0;
    }
  }
}
