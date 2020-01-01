# VISU

## Setup
### Install Node.js on Jetson Nano
## Install Node.js
https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/

## Connect to Jetson Nano
```bash
# Get IP Adress
cat /var/lib/misc/dnsmasq.leases
# Connect via ssh
ssh jodo@10.42.0.18
```

### feature list - ready
- panning
- draw distance numbers on grid (1 unit = 1 m)
- setting to turn on/off visus (e.g. frustum, grid, etc.)
- additional views: back, side, top
- different colors for different classes

### feature list - blocked
- the whole recording stuff:
  step forward / backward, slider, start, stop, pause, load recording, etc.


### Planing
- Connect via ethernet to jetson nano
- Make touchscreen work with laptop
- Display 2D boxes (for detection algo, in normalized coords)
- How to add this "debug" data the best way?
- Performance monitoring: Adding to Visu? Or seperate programm? For now better to add cause then only one data communication.
  C++ measure system + how to store the measurements + how to visualize?
- 