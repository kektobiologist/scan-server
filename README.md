# scan-server
network scanner server

## Instructions

* `sudo apt-get install sane imagemagick`
* edit `/etc/sane.d/dll.conf` to have only `hp` uncommented (if using hp scanner)
* `sudo npm install -g pm2`
* setup daemon to host server:
```
pm2 start index.js
sudo pm2 startup
sudo pm2 save
```
If it crashes, run `sudo pm2 startup systemd`
* edit `/etc/hosts` so that `scan-server` points to scanner machine's IP address, or alternatively change router DHCP+DNS to make `scan-server` point to scanner machine

NOTE: On windows, run NAPS2 to reconfigure printer to be used if changing printer
