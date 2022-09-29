import * as ecal from "nodejs-ecal"
import { ICom, IComCallback } from "./icom"
import { store } from "./../redux/store"
import { hanldeProtobufMsg } from "./msg_handler"


export class Ecal extends ICom {
  private subs: ecal.Subscriber[] = [];
  private client: ecal.Client;
  private cbCounter: number = 0;
  private callbacks: { [cbIndex: number]: IComCallback } = {}; // dict with key = cbIndex and callback function

  constructor() {
    super();
    ecal.initialize();
    this.client = new ecal.Client(store.getState().connection.serverName);
    this.client.addResponseCallback(this.clientCallback);
    store.getState().connection.topicSubs.forEach((value) => {
      let ecalSub = new ecal.Subscriber(value);
      ecalSub.addReceiveCallback(this.subCallback);
      this.subs.push(ecalSub);
    });
  }

  private subCallback(topic: string, msg: ArrayBuffer) {
    let payload = new Uint8Array(msg);
    hanldeProtobufMsg(topic, payload);
  }

  private clientCallback(res: ecal.SServiceResponse) {
    if (res.callState == ecal.eCallState.call_state_failed) {
      console.warn("Msg to server failed:");
      console.log(res);
      return;
    }
    const msg: any = JSON.parse(res.response);
    const cbIndex: number = msg["cbIndex"];
    if (cbIndex !== -1 && cbIndex in this.callbacks) {
      this.callbacks[cbIndex](msg["data"]);
      delete this.callbacks[cbIndex];
    }
  }

  public async sendMsg(endpoint: string, msg: string = "", cb: IComCallback = null) {
    let cbIndex = -1;
    if (cb !== null) {
      cbIndex = this.cbCounter++;
      this.callbacks[cbIndex] = cb;
    }
    const jsonMsg: string = JSON.stringify({
      "data": msg,
      "cbIndex": cbIndex
    });
    this.client.callAsync(endpoint, jsonMsg, -1);

    if (this.cbCounter > 500000) {
      this.cbCounter = 0;
    }
  }
}
