# VISU

Visualize Environment for automtive sensor algorithms. Recives Cap'n Proto data via TCP sockets and uses Electron and Babylon.JS to visualize the scene. Related C++ Core App: https://github.com/j-o-d-o/app-frame.
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

## Running on Remote machine
When running on a remote machine the two machines will need a TCP connection. Find the IP of the remote and connect to this IP via the GUI on visu app.
#### Find IP address without Monitor
```bash
# check your ip (ifconfig) and then use nmap
sudo namp -sn 10.42.0.0/24
# this will output your own ip and the ip of the raspberry pi
```
#### Start on remote machine
```bash
# Find out the IP of the device
# ssh into it
ssh user@IP
# Clone, build and start
git clone ...
cd visu
./scripts/dependencies.sh
./scripts/build.sh --build_type=release
./dist/bin/release/app

# Copy recordings from remote device
scp -rp user@IP:/path/to/storage_data ~/local/folder 
```

## Issues
- On weaker computers the processing of data is slower than the rate data is recived which leads to issues such as not recognizing key press, a lag in pause (multiple frames are still played), etc. 
Solution could be to have a rec speed setting in the backend and adjust it automatically in this case.
- So, we can not update styled components, because the new version has problems with RMWC. This problem would be fixed in the new RMWC, but upgrading RMWC has then a new issue with styled components. Most probably styled components has an issue there. Further investiagtion needed.

## TODO
- Select IP to connect to on the interface and ability to disconnect and connect to different IP on the fly
- Compare interface version from TCP packages with the internal one and visualize in case there is a missmatch
