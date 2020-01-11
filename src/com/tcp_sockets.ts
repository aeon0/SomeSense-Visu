import { IPC } from 'node-ipc'
import { encode, RawImageData } from 'jpeg-js'
import { store } from '../redux/store'
import { IReduxWorld } from '../redux/world/types'
import { parseWorldObj } from '../redux/world/parse'
import { setConnecting, setConnected } from '../redux/connection/actions'
import { updateWorld, resetWorld } from '../redux/world/actions'
import { updateSensorStorage, resetSensorStorage } from '../redux/sensor_storage/actions'
import { ISensorData } from '../redux/sensor_storage/types'


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
        store.dispatch(resetSensorStorage());
        this.headerBytesToRead = HEADERSIZE;
        this.payloadBytesToRead = 0;
        console.log('## disconnected from server ##');
      });

      this.ipc.of.server.on('data', (data: any) => {
        let readIdx: number = 0; // Idx in data which we currently want to read (including the readIdx)
        while (readIdx < (data.length - 1)) {
          const bytesLeft: number = data.length - readIdx;
          if (this.headerBytesToRead > 0) {
            // Check if we can read everything and adjust headerByteToRead
            const readNextFrame = Math.max(0, this.headerBytesToRead - bytesLeft);
            const readDataNow = this.headerBytesToRead - readNextFrame;

            // Read header from data
            const dataStart = readIdx;
            const dataEnd = readIdx + readDataNow;
            const headerOffset = HEADERSIZE - this.headerBytesToRead;
            this.currHeader.set(data.slice(dataStart, dataEnd), headerOffset);
            readIdx = dataEnd;

            // In case we need to read some frames from the next frame
            this.headerBytesToRead = readNextFrame;

            // In case header is read completely -> read size of payload
            if (this.headerBytesToRead == 0) {
              if (this.currHeader[0] != 0x0F) {
                console.log("WARNING: Wrong msg start byte, msg properly corrupted");
              }
              this.payloadBytesToRead = (this.currHeader[1] << 24) + (this.currHeader[2] << 16) + (this.currHeader[3] << 8) + this.currHeader[4];
              this.currPayload = new Uint8Array(this.payloadBytesToRead);
              // console.log("Payload Size [Byte]: " + this.currPayload.length);
            }
          }
          else if (this.payloadBytesToRead > 0) {
            // Check if we can read everything and adjust payloadByteToRead
            const readNextFrame = Math.max(0, this.payloadBytesToRead - bytesLeft);
            const readDataNow = this.payloadBytesToRead - readNextFrame;

            // Read payload from data
            const dataStart = readIdx;
            const dataEnd = readIdx + readDataNow;
            const payloadOffset = this.currPayload.length - this.payloadBytesToRead;
            this.currPayload.set(data.slice(dataStart, dataEnd), payloadOffset);
            readIdx = dataEnd;

            // In case we need to read some frames from the next frame
            this.payloadBytesToRead = readNextFrame;

            if (this.payloadBytesToRead == 0) {
              this.headerBytesToRead = HEADERSIZE;
              this.handleMsg();
            }
          }
          else {
            console.log("WARINING: readIdx is not at end, but no more bytes are to read...");
            break;
          }
        }
      });
    });
  }

  private handleMsg() {
    // First lets copy header and payload
    const header = this.currHeader.slice(0);
    const payload = this.currPayload.slice(0);

    const type: number = header[5];
    if (type == 1) { // Json message
      const msgStr: string = new TextDecoder("utf-8").decode(payload);
      try {
        const msg: any = JSON.parse(msgStr);
        if(msg["type"] == "server.frame") {
          // TODO: the parsing could have all sorts of missing fields or additional fields
          //       Ideally this would be checked somehow, but for now... whatever
          const frameData: IReduxWorld = parseWorldObj(msg["data"]);
          // TODO: match images from the sensor storage to the sensor meta data of the frameData
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
        console.log("WARNING: Error with json server msg:");
        console.log(msgStr);
        // console.log(e);
      }
    }
    else if (type == 16) { // Raw image
      // width [6-7], height [8-9], channels [10]
      const width: number = (header[6] << 8) + header[7];
      const height: number = (header[8] << 8) + header[9];
      const channels: number = header[10];
      // timestamp [11-18], could be used to show delta time to data which is visualized
      const ts: number = (header[11] << 54) + (header[12] << 46) + (header[13] << 38) + (header[14] << 32) +
                         (header[15] << 24) + (header[16] << 16) + (header[17] << 8) + header[18];
      
      // sensor idx [19]
      const idx: number = header[19];

      // Convert raw buffer to base64 string
      const rawBuf: RawImageData<Uint8Array> = { width, height, data: payload };
      const jpgImg = encode(rawBuf, 50);
      const imageBase64: string = 'data:image/jpeg;base64,' + jpgImg.data.toString();

      let sensorData: ISensorData = { idx, ts, width, height, channels, imageBase64 };
      store.dispatch(updateSensorStorage(sensorData));
    }
    else {
      console.log("WARNING: Unkown message type " + type);
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
