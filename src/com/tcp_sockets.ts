import { IPC } from 'node-ipc'
import { store } from '../redux/store'
import { IReduxWorld } from '../redux/world/types'
import { parseWorldObj } from '../redux/world/parse'
import { setConnecting, setConnected } from '../redux/connection/actions'
import { updateWorld, resetWorld } from '../redux/world/actions'


// Inter Process Communication via TCP Sockets
export class IPCServer {
  private ipc = new IPC();
  private cbCounter: number = 0;
  private callbacks: { [cbIndex: number]: Function } = {}; // dict with key = cbIndex and callback function
  private streamStr: string = "";
  private streamData: Buffer;
  private bytesToRead: number = 0;

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
        console.log(data);

        // if (this.bytesToRead == 0) {
        //   // New message
        //   if (data[0] == 0x0F) {
        //     console.log("Read new msg...");
        //     const type: number = data[5];
        //     console.log(data[4] + ", " + data[3] + ", " + data[2] + ", " + data[1]);
        //     var test = new Int32Array([data[1], data[2], data[3], data[4]]);
        //     console.log(test[0]);
        //   }
        //   else {
        //     console.log("WARNING: Wrong msg start byte, not reading msg");
        //   }
        // }
        // else {
        //   // There are some bytes left to read from a previous message
        // }

        // this.streamStr += data.toString();

        // if(this.streamStr.endsWith("\n")) {
        //   // streamStr could have multiple messages, thus try to split on line endings and loop
        //   const strMessages: string[] = this.streamStr.split("\n");
        //   strMessages.pop();
        //   for(let msg of strMessages) {
        //     this.handleResponse(msg.slice(0));
        //   }
        //   this.streamStr = "";
        // }
      });
    });
  }

  private handleResponse(msgStr: string) {
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