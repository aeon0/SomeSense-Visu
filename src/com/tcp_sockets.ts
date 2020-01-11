import { IPC } from 'node-ipc'
import { store } from '../redux/store'
import { IReduxWorld } from '../redux/world/types'
import { parseWorldObj } from '../redux/world/parse'
import { setConnecting, setConnected } from '../redux/connection/actions'
import { updateWorld, resetWorld } from '../redux/world/actions'

const HEADERSIZE: number = 20;

// Inter Process Communication via TCP Sockets
export class IPCServer {
  private ipc = new IPC();
  private cbCounter: number = 0;
  private callbacks: { [cbIndex: number]: Function } = {}; // dict with key = cbIndex and callback function

  private currPayload: Uint8Array;
  private currHeader = new Uint8Array(HEADERSIZE);
  private payloadBytesToRead: number = 0;
  private headerBytesToRead: number = HEADERSIZE;

  constructor() {
    this.ipc.config.id = 'visu_client';
    this.ipc.config.silent = true;
    this.ipc.config.retry = 2000; // time between reconnects in [ms]
    this.ipc.config.rawBuffer = true;
    this.ipc.config.encoding = "hex";

    // Use localhost in case server is on same machine, ip in case algo is running on another machine
    this.ipc.config.networkHost = "localhost";
    // this.ipc.config.networkHost = "10.42.0.81";

    this.ipc.config.networkPort = 8999;
    this.callbacks = {};

    this.start();
  }

  private start() {
    store.dispatch(setConnecting());

    console.log("Start Connection to server...");

    this.ipc.connectToNet('server', () => {
      this.ipc.of.server.on('connect', () => {
        console.log("## connected to server ##");
        store.dispatch(setConnected());
        this.sendMessage("register", { "id": this.ipc.config.id });
      });

      this.ipc.of.server.on('disconnect', () => {
        // Retry connecting
        store.dispatch(setConnecting());
        store.dispatch(resetWorld());
        this.ipc.log('## disconnected from server ##');
      });

      this.ipc.of.server.on('data', (data: any) => {
        let readIdx: number = 0; // Idx in data which we currently want to read (including the readIdx)
        while (readIdx < (data.length - 1)) {
          const bytesLeft: number = data.length - readIdx;
          if (this.headerBytesToRead > 0) {
            console.log("Reading Header...");
            
            // Check if we can read everything and adjust headerByteToRead
            const readNextFrame = Math.max(0, this.headerBytesToRead - bytesLeft);
            const readDataNow = this.headerBytesToRead - readNextFrame;
            this.headerBytesToRead = readNextFrame;

            // Read header from data
            const dataStart = readIdx;
            const dataEnd = readIdx + readDataNow;
            const headerOffset = HEADERSIZE - readDataNow;
            this.currHeader.set(data.slice(dataStart, dataEnd), headerOffset);
            readIdx = dataEnd;

            // In case we need to read some frames from the next frame
            this.headerBytesToRead = readNextFrame;

            // In case header is read completely -> read size of payload
            if (this.headerBytesToRead == 0) {
              console.log("Finished reading header");
              if (this.currHeader[0] != 0x0F) {
                console.log("WARNING: Wrong msg start byte, msg properly corrupted");
              }
              this.payloadBytesToRead = (data[1] << 24) + (data[2] << 16) + (data[3] << 8) + data[4];
              this.currPayload = new Uint8Array(this.payloadBytesToRead);
            }
          }
          else if (this.payloadBytesToRead > 0) {
            console.log("Reading Payload...");

            // Check if we can read everything and adjust payloadByteToRead
            const readNextFrame = Math.max(0, this.payloadBytesToRead - bytesLeft);
            const readDataNow = this.payloadBytesToRead - readNextFrame;
            this.payloadBytesToRead = readNextFrame;

            // Read payload from data
            const dataStart = readIdx;
            const dataEnd = readIdx + readDataNow;
            const payloadOffset = this.currPayload.length - readDataNow;
            this.currPayload.set(data.slice(dataStart, dataEnd), payloadOffset);
            readIdx = dataEnd;

            if (this.payloadBytesToRead == 0) {
              console.log("Finished reading payload");
              this.headerBytesToRead = HEADERSIZE;
              this.handleMsg();
            }
          }
          else {
            console.log("WARINING: readIdx is not at end, but no more bytes are to read...");
            break;
          }
        }
        console.log("--- Frame End ---");
      });
    });
  }

  private handleMsg() {
    // First lets copy header and payload
    const header = this.currHeader.slice(0);
    const payload = this.currPayload.slice(0);

    const type: number = header[5];
    if (type == 1) {
      // Json message
      const msgStr: string = new TextDecoder("utf-8").decode(payload);
      this.handleJsonMsg(msgStr);
    }
    else {
      console.log("WARNING: Unkown message type " + type);
    }
  }

  private handleJsonMsg(msgStr: string) {
    try {
      const msg: any = JSON.parse(msgStr);
      if(msg["type"] == "server.frame") {
        // TODO: the parsing could have all sorts of missing fields or additional fields
        //       Ideally this would be checked somehow, but for now... whatever
        const frameData: IReduxWorld = parseWorldObj(msg["data"]);
        store.dispatch(updateWorld(frameData));
      }
      else if(msg["type"] == "server.callback") {
        // Callback for some request, search for callback in the callback list and execute
        const cbIndex: number = msg["cbIndex"];
        if (cbIndex in this.callbacks) {
          this.callbacks[cbIndex](msg["data"]);
          delete this.callbacks[cbIndex];
        }
      }
      else {
        console.log("WARNING: Unkown server message: " + msg["type"]);
      }
    }
    catch (e) {
      console.log("WARNING: Error with server msg:");
      console.log(msgStr);
      // console.log(e);
    }
  }

  public sendMessage(type: string, msg: any = "", cb: Function = null) {
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
      });
      this.ipc.of.server.emit(jsonMsg + "\n");
    }
    else {
      console.log("WARNING: trying to send message but there is no server connection!");
    }

    if (this.cbCounter > 500000) {
      this.cbCounter = 0;
    }
  }
}
