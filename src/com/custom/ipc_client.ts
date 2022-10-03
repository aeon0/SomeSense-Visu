import { ICom, IComCallback } from '../icom'
import { IPC } from 'node-ipc'
import { store } from '../../redux/store'
import { setConnected } from '../../redux/connection'
import { hanldeProtobufMsg } from "../msg_handler"
import { MsgType } from './msg_types'


// From: https://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array/18729931
export function toUTF8Array(str: string) {
  var utf8 = [];
  for (var i=0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 
                0x80 | (charcode & 0x3f));
    }
    else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12), 
                0x80 | ((charcode>>6) & 0x3f), 
                0x80 | (charcode & 0x3f));
    }
    // surrogate pair
    else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                | (str.charCodeAt(i) & 0x3ff));
      utf8.push(0xf0 | (charcode >>18), 
                0x80 | ((charcode>>12) & 0x3f), 
                0x80 | ((charcode>>6) & 0x3f), 
                0x80 | (charcode & 0x3f));
    }
  }
  return utf8;
}


// Client for IPC communication via TCP Sockets
// Custom Protocol Header (Size: 16 byte, Little Endian):
//   [0-1]:  Start bytes, expected: 0x0FF0
//   [1-5]:  Payload size in bytes
//   [6]:    Message type: 0x01: Json in form of {type: string, cbIndex: int, data: any}
//                         0x02: Packed Capnp (CapnpOutput::Frame)
//   [7-8]:  Interface verison byte [7]: major [8]: minor
//           TODO: use the interface version to check for compatibility
//   [9-15]: Currently not in use

enum Reading {
  HEADER = 0,
  PAYLOAD
}
const HEADERSIZE: number = 16;

export class IPCClient extends ICom{
  private ipc = new IPC();
  private cbCounter: number = 0;
  private callbacks: { [cbIndex: number]: IComCallback } = {}; // dict with key = cbIndex and callback function

  private currPayload: Uint8Array;
  private currHeader = new Uint8Array(HEADERSIZE);
  private bytesToRead: number = HEADERSIZE;
  private reading = Reading.HEADER;
  private isReadingPkg = false;
  private connected: boolean;

  constructor() {
    super();

    this.ipc.config.id = 'somesense_app_ipc_client';
    this.ipc.config.silent = true;
    this.ipc.config.retry = 1000; // time between reconnects in [ms]
    this.ipc.config.stopRetrying = false;
    this.ipc.config.rawBuffer = true;
    this.ipc.config.encoding = "hex";
    this.ipc.config.networkHost = store.getState().connection.ip;
    this.ipc.config.networkPort = store.getState().connection.port;
    this.callbacks = {};

    this.connected = store.getState().connection.connected;
    if (!this.connected) {
      this.start();
    }
  }

  private start() {
    console.log("## start listening for server connections on " + this.ipc.config.networkHost + " #");

    this.ipc.connectToNet('server', () => {
      this.ipc.of.server.on('connect', () => {
        console.log("## connected to server ##");
        store.dispatch(setConnected(true));
        this.sendMsg("frame_ctrl", {"action": "sync"}, () => {
          console.log("Synced successfull");
        });
      });

      this.ipc.of.server.on('disconnect', () => {
        this.bytesToRead = HEADERSIZE;
        this.reading = Reading.HEADER;
        store.dispatch(setConnected(false));
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
              this.readHeader();
              // this.currPayload and this.currHeader should be filled correctly. Lets read the message
              const payload = this.currPayload.slice(); // copy since handleMsgData is a async function
              const msgType: MsgType = this.currHeader[6];
              if (msgType == MsgType.JSON) {
                this.handleJsonMsg(payload);
              }
              else if (msgType != MsgType.UNDEF) {
                hanldeProtobufMsg(msgType, payload);
              }
              else {
                console.log("Can not handle MsgType: " + msgType);
              }
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

  public async handleJsonMsg(payload: Uint8Array) {
    const msgStr: string = new TextDecoder("utf-8").decode(payload);
    if (msgStr == "") {
      return;
    }
    try {
      const msg: any = JSON.parse(msgStr);
      const cbIndex: number = msg["cbIndex"];
      if (cbIndex !== -1 && cbIndex in this.callbacks) {
        this.callbacks[cbIndex](msg["data"]);
        delete this.callbacks[cbIndex];
      }
    }
    catch (e) {
      console.error("Error with json msg from Server:");
      console.log(msgStr);
      console.log(e);
    }
  }

  public async sendMsg(endpoint: string, msg: any = "", cb: IComCallback = null) {
    if (store.getState().connection.connected) {
      let cbIndex = -1;
      if (cb !== null) {
        cbIndex = this.cbCounter++;
        this.callbacks[cbIndex] = cb;
      }
      const jsonMsg: string = JSON.stringify({
        "endpoint": endpoint,
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
