# SomeSense - Visualization

Visualize Environment for automtive sensor algorithms. Recives Cap'n Proto data via TCP sockets and uses Electron and Babylon.JS to visualize the scene. Related C++ Core App: https://github.com/j-o-d-o/SomeSense-App.

![Example](./assets/example.gif?raw=true)

## Install
Node.js and npm needs to be installed (tested with node version 14.15.1).
```bash
npm install
npm start 
```
## Add new Algo visualization
If you have a new algo or extend an exisiting one, this is what you want to do:</br>
TODO

## Issues
- On weaker computers the processing of data is slower than the rate data is recived which leads to issues such as not recognizing key press, a lag in pause (multiple frames are still played), etc. 
Solution could be to have a rec speed setting in the backend and adjust it automatically in this case.
- Leave typescript at 4.0.2 because of babylon-js
- Leave node-ipc at 9.x because of commonjs
- Leave react at 16.x because of rmwc support

## TODO
- Compare interface version from TCP packages with the internal one and visualize in case there is a missmatch
