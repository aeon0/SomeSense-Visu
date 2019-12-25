import { IPC } from 'node-ipc'
import { store } from '../redux/store'
import { IReduxWorld } from '../redux/world/types'
import { parseWorldObj } from '../redux/world/parse'
import { setConnecting, setConnected } from '../redux/connection/actions'
import { updateWorld, resetWorld } from '../redux/world/actions'

let streamStr: string = "";

function updateFrame(msgStr: string) {
  try {
    const msg: any = JSON.parse(msgStr);
    if(msg["type"] == "server.frame") {
      // TODO: the parsing could have all sorts of missing fields or additional fields
      //       Ideally this would be checked somehow, but for now... whatever
      const frameData: IReduxWorld = parseWorldObj(msg["data"]);
      store.dispatch(updateWorld(frameData));
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

export class IPCServer {
  private ipc = new IPC();

  constructor() {
    this.ipc.config.id = 'visu_client';
    this.ipc.config.silent = true;
    this.ipc.config.retry = 2000; // time between reconnects in [ms]
    this.ipc.config.rawBuffer = true;
  }

  public start() {
    store.dispatch(setConnecting());

    console.log("Start Connection to server...");

    this.ipc.connectTo('server', '/tmp/unix-socket', () => {
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
        streamStr += data.toString();

        if(streamStr.endsWith("\n")) {
          // streamStr could have multiple messages, thus try to split on line endings and loop
          const strMessages: string[] = streamStr.split("\n");
          strMessages.pop();
          for(let msg of strMessages) {
            updateFrame(msg.slice(0));
          }
          streamStr = "";
        }
      });
    });
  }
}
