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