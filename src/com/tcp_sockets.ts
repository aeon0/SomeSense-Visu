import { IPC } from 'node-ipc'
import { encode, RawImageData } from 'jpeg-js'
import { store } from '../redux/store'
import { IReduxWorld } from '../redux/world/types'
import { parseWorldObj } from '../redux/world/parse'
import { ICtrlData } from '../redux/ctrl_data/types'
import { parseCtrlData } from '../redux/ctrl_data/parse'
import { setConnecting, setConnected } from '../redux/connection/actions'
import { updateWorld, resetWorld } from '../redux/world/actions'
import { updateCtrlData } from '../redux/ctrl_data/actions'
import { updateSensorStorage, resetSensorStorage } from '../redux/sensor_storage/actions'
import { ISensorData } from '../redux/sensor_storage/types'


enum Reading {
  HEADER = 0,
  PAYLOAD
}
const HEADERSIZE: number = 20;

// From: https://stackoverflow.com/questions/18729405/how-to-convert-utf8-string-to-byte-array/18729931
function toUTF8Array(str: string) {
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

// Inter Process Communication via TCP Sockets
export class IPCServer {
  private ipc = new IPC();
  private cbCounter: number = 0;
  private callbacks: { [cbIndex: number]: Function } = {}; // dict with key = cbIndex and callback function

  private currPayload: Uint8Array;
  private currHeader = new Uint8Array(HEADERSIZE);
  private bytesToRead: number = HEADERSIZE;
  private reading = Reading.HEADER;

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
        this.bytesToRead = HEADERSIZE;
        this.reading = Reading.HEADER;
        console.log('## disconnected from server ##');
      });

      this.ipc.of.server.on('data', (data: any) => {
        let readIdx: number = 0; // Idx in data which we currently want to read (including the readIdx)
        while (readIdx < (data.length - 1)) {
          const bytesLeft: number = data.length - readIdx;

          if (this.bytesToRead > 0) {
            // Check if we can read everything and adjust this.bytesToRead if needed
            const readNextFrame = Math.max(0, this.bytesToRead - bytesLeft);
            const readDataNow = this.bytesToRead - readNextFrame;

            // Read header from data
            const dataStart = readIdx;
            const dataEnd = readIdx + readDataNow;
            if (this.reading == Reading.HEADER) {
              const offset = HEADERSIZE - this.bytesToRead;
              this.currHeader.set(data.slice(dataStart, dataEnd), offset);
            }
            else if (this.reading == Reading.PAYLOAD) {
              const offset = this.currPayload.length - this.bytesToRead;
              this.currPayload.set(data.slice(dataStart, dataEnd), offset);
            }
            readIdx = dataEnd;

            // In case we need to read some bytes from the next frame
            this.bytesToRead = readNextFrame;

            // In case header is read completely
            if (this.bytesToRead == 0) {
              if (this.reading == Reading.HEADER) {
                if (this.currHeader[0] != 0x0F) {
                  console.log("WARNING: Wrong msg start byte, msg properly corrupted. App / Connection probably needs a restart.");
                }
                this.bytesToRead = (this.currHeader[1] << 24) + (this.currHeader[2] << 16) + (this.currHeader[3] << 8) + this.currHeader[4];
                this.currPayload = new Uint8Array(this.bytesToRead);
                this.reading = Reading.PAYLOAD;
                // console.log("Payload Size [Byte]: " + this.currPayload.length);
              }
              else if (this.reading == Reading.PAYLOAD) {
                this.bytesToRead = HEADERSIZE;
                this.reading = Reading.HEADER;
                this.handleMsg();
              }
            }
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
          const frameData: IReduxWorld = parseWorldObj(msg["data"]["frame"]);
          const ctrlData: ICtrlData = parseCtrlData(msg["data"]["ctrlData"]);
          // Match images from the sensor storage to the sensor meta data of the frameData
          for (let sensor of frameData.camSensors) {
            for (let data of store.getState().sensorStorage) {
              if (sensor.idx == data.idx) {
                sensor.imageBase64 = data.imageBase64;
              }
            }
          }

          store.dispatch(updateWorld(frameData));
          store.dispatch(updateCtrlData(ctrlData));
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
      var frameData = new Buffer(width * height * 4);
      var i = 0;
      var x = 0;
      while (i < frameData.length) {
        const b = payload[x++];
        const g = payload[x++];
        const r = payload[x++];
        frameData[i++] = r; // red
        frameData[i++] = g; // green
        frameData[i++] = b; // blue
        frameData[i++] = 0xFF; // alpha - ignored in JPEGs
      }
      const rawBuf: RawImageData<Buffer> = { width, height, data: frameData };
      const jpgImg = encode(rawBuf, 50);
      const imageBase64: string = 'data:image/jpeg;base64,' + jpgImg.data.toString('base64');

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
      }) + "\n";

      this.ipc.of.server.emit(toUTF8Array(jsonMsg));
    }
    else {
      console.log("WARNING: trying to send message but there is no server connection!");
    }

    if (this.cbCounter > 500000) {
      this.cbCounter = 0;
    }
  }
}
