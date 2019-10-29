import { IPC } from 'node-ipc'


export function StartIPC() {
  const ipc = new IPC();
  ipc.config.id = 'visu_client';
  ipc.config.retry = 3;
  ipc.config.maxRetries = true;

  ipc.connectTo(
    'server',
    () => {
      ipc.of.server.on(
        'connect',
        () => {
          ipc.log("## connected to world ##");
          ipc.of.world.emit(
            'app.message',
            {
              id : ipc.config.id,
              message: 'hello'
            }
          )
        }
      );
      ipc.of.server.on(
        'disconnect',
        () => {
          ipc.log('disconnected from world');
        }
      );
      ipc.of.server.on(
        'app.message',
        (data: any) => {
          ipc.log('got a message from world : ', data);
        }
      );

      console.log(ipc.of.server.destroy);
    }
  )
}
