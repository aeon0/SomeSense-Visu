import { IPC } from 'node-ipc'
import { store } from '../redux/store'
import * as capnp from 'capnp-ts';
import { CapnpOutput_Frame } from './frame.capnp'
import { setConnecting, setConnected, waitForData } from '../redux/connection/actions'
// World store
import { IReduxWorld } from '../redux/world/types'
import { updateWorld, resetWorld } from '../redux/world/actions'
import { parseWorldObj } from '../redux/world/parse'
// CtrlData store
import { ICtrlData } from '../redux/ctrl_data/reducer'
import { updateCtrlData, resetCtrlData } from '../redux/ctrl_data/actions'
// RuntimeMeas store
import { IRuntimeMeasFrame } from "../redux/runtime_meas/reducer"
import { addRuntimeMeas } from "../redux/runtime_meas/actions"
import { praseRuntimeMeasFrameData } from "../redux/runtime_meas/parse"


enum Reading {
  HEADER = 0,
  PAYLOAD
}
const HEADERSIZE: number = 16;

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
  private isReadingPkg = false;
  private waitForData = false;

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
        store.dispatch(waitForData());
        this.waitForData = true;
      });

      this.ipc.of.server.on('disconnect', () => {
        // Retry connecting
        store.dispatch(setConnecting());
        store.dispatch(resetWorld());
        store.dispatch(resetCtrlData());
        this.bytesToRead = HEADERSIZE;
        this.reading = Reading.HEADER;
        console.log('## disconnected from server ##');
      });

      this.ipc.of.server.on('data', (data: any) => {
        // The header bytes are:
        // [0-1]: Start bytes 0x0FF0
        // [1-5]: Payload size in bytes (little-endian)
        // [6]:   Message type, 0x01: Json, 0x02: Capnp

        let currReadPos: number = 0; // current position of reading bytes of this package
        if (this.isReadingPkg) {
          console.log("WARNING: Still reading previous Message, dropping this package...");
          return;
        }
        while (currReadPos != data.length) {
          this.isReadingPkg = true;
          if (currReadPos > data.length) {
            console.log("WARNING: Well, this is akward. This should not happen. We have seen more bytes then the pkg length. Must be a bug.");
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
                console.log("WARNING: Wrong msg start byte. Drop Package and trying to read Header in next Package.");
                this.bytesToRead = HEADERSIZE;
                this.reading = Reading.HEADER;
                break;
              }
              else {
                this.bytesToRead = (this.currHeader[2] << 24) + (this.currHeader[3] << 16) + (this.currHeader[4] << 8) + this.currHeader[5];
                if (this.bytesToRead < 0) {
                  console.log("WARNING: Payload size negative. Trying to read header again. Bug...")
                  this.bytesToRead = HEADERSIZE;
                  this.reading = Reading.HEADER;
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

                this.sendMessage("get_ctrl_data", {}, (data: any) => {
                  var ctrlData: ICtrlData = {
                    isStoring: false,
                    isPlaying: false,
                    isARecording: false,
                    recLength: -1,
                  }
                  if ("store_info" in data) {
                    ctrlData.isStoring = data["store_info"]["is_storing"];
                  }
                  if ("rec_info" in data) {
                    ctrlData.isARecording = data["rec_info"]["is_rec"];
                    ctrlData.isPlaying = data["rec_info"]["is_playing"];
                    ctrlData.recLength = data["rec_info"]["rec_length"];
                  }
                  store.dispatch(updateCtrlData(ctrlData));
                });
              }

              this.bytesToRead = HEADERSIZE;
              this.reading = Reading.HEADER;
              // this.currPayload and this.currHeader should be filled correctly. Lets read the message
              const header = this.currHeader.slice(0);
              const payload = this.currPayload.slice(0);
              // copy is important since this is a async function in order to not block tpc package reading
              this.handleMsg(header, payload);
            }
          }
        }
        this.isReadingPkg = false;
      });
    });
  }

  private async handleMsg(header: Uint8Array, payload: Uint8Array) {
    const type: number = header[6];
    if (type == 1) { // Json message
      const msgStr: string = new TextDecoder("utf-8").decode(payload);
      try {
        const msg: any = JSON.parse(msgStr);
        if(msg["type"] == "server.callback") {
          // Callback for some request, search for callback in the callback list and execute
          const cbIndex: number = msg["cbIndex"];
          if (cbIndex !== -1 && cbIndex in this.callbacks) {
            this.callbacks[cbIndex](msg["data"]);
            delete this.callbacks[cbIndex];
          }
        }
        else {
          console.log("WARNING: Unkown server message: " + msg["type"]);
        }
      }
      catch (e) {
        console.log("WARNING: Error with json msg from Server:");
        console.log(msgStr);
        // console.log(e);
      }
    }
    else if (type == 2) { // Frame Data in Capnp format
      const message = new capnp.Message(payload);
      const frameData: CapnpOutput_Frame = message.getRoot(CapnpOutput_Frame);
      
      const reduxWorld: IReduxWorld = parseWorldObj(frameData);
      const runtimeMeasFrame: IRuntimeMeasFrame = praseRuntimeMeasFrameData(frameData);
      store.dispatch(updateWorld(reduxWorld));
      store.dispatch(addRuntimeMeas(runtimeMeasFrame));
    }
    else {
      console.log("WARNING: Unkown message type " + type);
    }
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
