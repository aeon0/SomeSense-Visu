# VISU

## Setup
### Install Node.js on Jetson Nano
## Install Node.js
https://www.instructables.com/id/Install-Nodejs-and-Npm-on-Raspberry-Pi/

## Install and Workaround Notes
There is an [issue](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33311) with stylecomponents which includes reacte-native typings as dependency which clash with dom typings. Thus in postinstall these typings need to be removed.

Tere is an [issue](https://github.com/microsoft/TypeScript/issues/34933) with typescript and too many props or something like that. Solution: Leave typescript at v3.6.4...

There is an [issue](https://github.com/electron/electron/issues/21612) with electron typings not being compatiable with the latest node (v.12.14.0). This [PR](https://github.com/electron/typescript-definitions/pull/163) fixes that, but is not yet merged. Thus gotta downgrade node :/
```bash
sudo npm install n -g
# for the lts
sudo n lts
# for the latest stable one
sudo n stable
# for specific version
sudo n 10.2.18
```

## Start Jetpack
```bash
# Only works with native Ubuntu, on linux mint do this
export LSB_ETC_LSB_RELEASE=/etc/upstream-release/lsb-release
sdkmanager
```

## Connect to Jetson Nano
```bash
# Get IP Adress
cat /var/lib/misc/dnsmasq.leases
# Connect via ssh
ssh jodo@10.42.0.18
```

### Planing
- (DONE) Connect via ethernet to jetson nano
- Make touchscreen work with laptop
- Display 2D boxes (for detection algo, in normalized coords)
- How to add this "debug" data the best way?
- Performance monitoring: Adding to Visu? Or seperate programm? For now better to add cause then only one data communication. C++ measure system + how to store the measurements + how to visualize?
- Make CSI Cam work again...