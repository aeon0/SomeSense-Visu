# VISU

So, we can not update styled components, because the new version has problems with RMWC. This problem would be fixed in the new RMWC, but upgrading RMWC has then a new issue with styled components. Most probably styled components has an issue there. Further investiagtion needed.

### Connect to Remote Board
```bash
# Find out the IP of the device
# ssh into it
ssh user@IP
# Clone, build and start OpenCep
git clone ...
cd OpenCep
./scripts/dependencies.sh
./scripts/build.sh --build_type=release
./dist/bin/release/OpenCep

# Copy recordings from remote device
scp -rp user@IP:/path/to/storage_data ~/local/folder 
```

#### Find IP address without Monitor
```bash
# check your ip (ifconfig) and then use nmap
sudo namp -sn 10.42.0.0/24
# this will output your own ip and the ip of the raspberry pi
```

### Planing
- Display 2D boxes (for detection algo, in normalized coords)
- How to add this "debug" data the best way?
