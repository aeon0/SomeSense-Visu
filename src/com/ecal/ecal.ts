import * as ecal from "nodejs-ecal"
import { ICom, IComCallback } from "./../icom"
import { store } from "./../../redux/store"
import { hanldeProtobufMsg } from "../msg_handler"
import { setConnected } from "../../redux/connection"
import * as promises from "timers/promises"


export class Ecal extends ICom {
  private subs: Record<string, {connected: boolean, instance: ecal.Subscriber}> = {};
  private client: {connected: boolean, instance: ecal.Client};
  private cbCounter: number = 0;
  private callbacks: { [cbIndex: number]: IComCallback } = {}; // dict with key = cbIndex and callback function

  constructor() {
    super();
    ecal.initialize();
    store.getState().connection.topicSubs.forEach((value) => {
      let ecalSub = new ecal.Subscriber(value);
      ecalSub.addReceiveCallback(this.subCallback.bind(this));
      ecalSub.addEventCallback(ecal.eCAL_Subscriber_Event.sub_event_connected, this.subEvent.bind(this));
      ecalSub.addEventCallback(ecal.eCAL_Subscriber_Event.sub_event_disconnected, this.subEvent.bind(this));
      ecalSub.addEventCallback(ecal.eCAL_Subscriber_Event.sub_event_corrupted, this.subEvent.bind(this));
      ecalSub.addEventCallback(ecal.eCAL_Subscriber_Event.sub_event_dropped, this.subEvent.bind(this));
      ecalSub.addEventCallback(ecal.eCAL_Subscriber_Event.sub_event_timeout, this.subEvent.bind(this));
      this.subs[value] = {
        connected: false,
        instance: ecalSub
      };
    });

    let ecalClient = new ecal.Client(store.getState().connection.serverName);
    ecalClient.addResponseCallback(this.clientCallback.bind(this));
    ecalClient.addEventCallback(ecal.eCAL_Client_Event.client_event_connected, this.clientEvent.bind(this));
    ecalClient.addEventCallback(ecal.eCAL_Client_Event.client_event_disconnected, this.clientEvent.bind(this));
    ecalClient.addEventCallback(ecal.eCAL_Client_Event.client_event_timeout, this.clientEvent.bind(this));
    this.client = {
      connected: false,
      instance: ecalClient
    };
  }

  private async isEverythingConnected() {
    let allConnected = true;
    for (let k in this.subs) {
      allConnected &&= this.subs[k].connected;
    }
    allConnected &&= this.client.connected;
    store.dispatch(setConnected(allConnected));
    if (allConnected) {
      // HACK!
      // If we directly send it, most of the time the publisher wont receive anything, why??
      await promises.setTimeout(750);
      console.log("Everything Connected, send sync command");
      this.sendMsg("frame_ctrl", {"action": "sync"}, () => {
        console.log("Synced it from ecal");
      });
    }
  }

  private subEvent(topic: string, event: ecal.SSubEventCallbackData) {
    if (event.type == ecal.eCAL_Subscriber_Event.sub_event_dropped) {
      console.log("Frame dropped");
    }
    else {
      this.subs[topic].connected = event.type == ecal.eCAL_Subscriber_Event.sub_event_connected;
      console.log(topic + " is connected: " + this.subs[topic].connected);
      this.isEverythingConnected();
    }
  }

  private subCallback(topic: string, msg: ArrayBuffer) {
    let payload = new Uint8Array(msg);
    hanldeProtobufMsg(topic, payload);
  }

  private clientEvent(_: string, event: ecal.SClientEventCallbackData) {
    this.client.connected = event.type == ecal.eCAL_Client_Event.client_event_connected;
    console.log("Client is connected: " + this.client.connected);
    this.isEverythingConnected();
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
    this.client.instance.callAsync(endpoint, jsonMsg, -1);

    if (this.cbCounter > 500000) {
      this.cbCounter = 0;
    }
  }
}
