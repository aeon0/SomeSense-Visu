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
    store.getState().connection.topicSubs.forEach((value) => {
      let ecalSub = new ecal.Subscriber(value);
      ecalSub.addReceiveCallback(this.subCallback.bind(this));
      this.subs.push(ecalSub);
    });
    // Client should be created after subs since server is checking new connection
    // on server and provides the last frame via its publisher. If sub is not active yet we will not receive it
    this.client = new ecal.Client(store.getState().connection.serverName);
    this.client.addResponseCallback(this.clientCallback.bind(this));
  }

  private subCallback(topic: string, msg: ArrayBuffer) {
    let payload = new Uint8Array(msg);
    hanldeProtobufMsg(topic, payload);
  }

  private clientCallback(res: ecal.SServiceResponse) {
    if (res.call_state == ecal.eCallState.call_state_failed) {
      console.warn("Msg to server failed:");
      console.log(res);
      return;
    }
    if (res.response == "") {
      console.warn("Msg returned empty response");
      console.log(res);
      return;
    }
    const msg: any = JSON.parse(res.response);
    const cbIndex: number = "cbIndex" in msg ? msg["cbIndex"] : -1;
    if (cbIndex !== -1 && cbIndex in this.callbacks) {
      this.callbacks[cbIndex](msg["data"]);
      delete this.callbacks[cbIndex];
    }
  }

  public async sendMsg(endpoint: string, msg: any = "", cb: IComCallback = null) {
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
