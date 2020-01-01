import { IPC } from 'node-ipc'
import { store } from '../redux/store'
import { IReduxWorld } from '../redux/world/types'
import { parseWorldObj } from '../redux/world/parse'
import { setConnecting, setConnected } from '../redux/connection/actions'
import { updateWorld, resetWorld } from '../redux/world/actions'


// Inter Process Communication via Unix Sockets, currently only supports only one data source (one server)
export class IPCServer {
  private ipc = new IPC();
  private cbCounter: number = 0;
  private callbacks: { [cbIndex: number]: Function } = {}; // dict with key = cbIndex and callback function
  private streamStr: string = "";

  constructor() {
    this.ipc.config.id = 'visu_client';
    this.ipc.config.silent = true;
    this.ipc.config.retry = 2000; // time between reconnects in [ms]
    this.ipc.config.rawBuffer = true;
    // this.ipc.config.networkHost = "127.0.0.1";
    // this.ipc.config.networkPort = 8999;
    this.callbacks = {};

    this.start();
  }

  private start() {
    store.dispatch(setConnecting());

    console.log("Start Connection to server...");

    this.ipc.connectToNet('server', "10.42.0.1", 8999, () => {
      this.ipc.of.server.on('connect', () => {
        console.log("## connected to server ##");
        store.dispatch(setConnected());

        const registerMsg: string = JSON.stringify({
          "type": "client.register",
          "data": {
            "id": this.ipc.config.id
          }
        });
        this.ipc.of.server.emit(registerMsg + "\n");
      });

      this.ipc.of.server.on('disconnect', () => {
        // Retry connecting
        store.dispatch(setConnecting());
        store.dispatch(resetWorld());
        this.ipc.log('## disconnected from server ##');
      });

      this.ipc.of.server.on('data', (data: any) => {
        this.streamStr += data.toString();

        if(this.streamStr.endsWith("\n")) {
          // streamStr could have multiple messages, thus try to split on line endings and loop
          const strMessages: string[] = this.streamStr.split("\n");
          strMessages.pop();
          for(let msg of strMessages) {
            this.handleResponse(msg.slice(0));
          }
          this.streamStr = "";
        }
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
        console.log("Unkown server message: " + msg["type"]);
      }
    }
    catch (e) {
      console.log(e);
      console.log(msgStr);
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
