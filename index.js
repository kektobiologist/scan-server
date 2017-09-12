const express = require('express')
const app = express()

const exec = require('child_process').exec;

const cmd = "scanimage --format=tiff >/tmp/image.tiff && convert -quality 100 /tmp/image.tiff /tmp/image.jpg"

var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 5*1000, // 5 seconds 
  max: 1, // limit each IP to 1 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});
 
//  apply to all requests 
app.use(limiter);

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/scan', (req, res) => {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      res.status(400)
      res.send(err)
    } else {
      res.sendFile('/tmp/image.jpg')
    }
  })
})

port = 8899
app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})