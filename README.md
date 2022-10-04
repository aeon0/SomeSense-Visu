# SomeSense - Visualization

Visualization for automotive perception algorithms (currently only supports single camera setup).
Communication via Tcp Sockets or [eCAL](https://github.com/eclipse-ecal/ecal)
, receiving protobuf messages.


![Example](./assets/example.gif?raw=true)

## Install
Node.js and npm needs to be installed (tested with node version 14.15.1).
```bash
git clone https://github.com/aeon0/SomeSense-Visu.git
git submodule update --init --remote
npm install
npm start
```
Note for Windows: in `package.json` change `--plugin=./node_modules/.bin/protoc-gen-ts_proto` to `--plugin=./node_modules/.bin/protoc-gen-ts_proto.cmd`

Adjust the Ip and Host (for Tcp Sockets) or the topics (for eCAL) in `src/redux/connection.ts`.

## Issues
- On weaker computers the visualization of the pointcloud still doesnt perform well

## Notes
- Leave typescript at 4.6.2 because of babylon-js
- Leave node-ipc at 9.x, creator can not be trusted with updates. He put malware in some of the later versions!
