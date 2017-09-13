const express = require('express')
var cors = require('cors')
const app = express()

app.use(cors())

const exec = require('child_process').exec;

const cmd = "scanimage --resolution 100 --format=tiff >/tmp/image.tiff && convert -quality 100 /tmp/image.tiff /tmp/image.jpg"

var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 5*1000, // 5 seconds 
  max: 1, // limit each IP to 1 requests per windowMs 
  delayMs: 0 // disable delaying - full speed until the max limit is reached 
});
 
//  apply to all requests 
app.use(limiter);

var fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.get('/scan/test', (req, res) => {
  var base64str = base64_encode('/tmp/image.jpg');
  res.send(base64str)
})

app.get('/scan/testImage', (req, res) => {
  res.sendFile('/tmp/image.jpg')
})


app.get('/scan', (req, res) => {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.log(err)
      res.status(400)
      res.send(err)
    } else {
      var base64str = base64_encode('/tmp/image.jpg');
      res.send(base64str)
    }
  })
})

port = 8899
app.listen(port, function () {
  console.log('Example app listening on port ' + port)
})