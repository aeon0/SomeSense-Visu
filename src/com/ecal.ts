const ecal = require("nodejs-ecal")
import { ICom } from "./icom"
import { store } from "./../redux/store"
import { hanldeProtobufMsg } from "./msg_handler"
// import { setConnecting, setConnected, waitForData, setDisconnected } from '../redux/connection/actions'
// import { handleMsgData, resetAppState } from './data_handler'

import * as capnp from 'capnp-ts';
// import { CapnpOutput_Frame } from './frame.capnp.js'


export class Ecal extends ICom {
  private sub: any;
  private pub: any;
  private cbCounter: number = 0;
  private callbacks: { [cbIndex: number]: Function } = {}; // dict with key = cbIndex and callback function

  constructor() {
    super();
    this.pub = new ecal.Publisher(store.getState().connection.topicPub);
    this.sub = new ecal.Subscriber(store.getState().connection.topicSub);
    this.sub.addReceiveCallback(this.subCallback);
  }

  private subCallback(msg: ArrayBuffer) {
    var uint8View = new Uint8Array(msg);
    const payload = uint8View.slice();
    hanldeProtobufMsg(payload);
    // const frame: CapnpOutput_Frame = message.getRoot(CapnpOutput_Frame);
    // console.log(frame);
    // console.log(frame.getTimestamp().toNumber());
    // handleCapnpMsg(payload);
  }

  public async sendMsg(msg: any = "", cb: Function = null) {

  }

  // public async sendMessage(type: string, msg: any = "", cb: Function = null) {
  //   if (store.getState().connection.connected) {
  //     let cbIndex = -1;
  //     if (cb !== null) {
  //       cbIndex = this.cbCounter++;
  //       this.callbacks[cbIndex] = cb;
  //     }
  //     const jsonMsg: string = JSON.stringify({
  //       "type": "client." + type,
  //       "data": msg,
  //       "cbIndex": cbIndex
  //     }) + "\n"; // Server uses \n to determine end of message!

  //     this.ipc.of.server.emit(toUTF8Array(jsonMsg));
  //   }
  //   else {
  //     console.warn("No Server connection, sending message failed");
  //   }

  //   if (this.cbCounter > 500000) {
  //     this.cbCounter = 0;
  //   }
  // }
}
