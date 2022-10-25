const express = require("express");
var cors = require("cors");
const app = express();
var fs = require("fs");
var http = require("http");
var https = require("https");
var privateKey = fs.readFileSync("key.pem", "utf8");
var certificate = fs.readFileSync("cert.pem", "utf8");
var credentials = { key: privateKey, cert: certificate };

app.use(cors());

const child_process =  require("child_process");
const exec = child_process.exec;
const execSync = child_process.execSync;

const osName = execSync("uname").toString("utf8");
var cmd;
if (!/Darwin/.test(osName))
  cmd =
    "scanimage --compression None --resolution 100 --format=tiff >/tmp/image.tiff && convert -quality 100 /tmp/image.tiff /tmp/image.jpg";
else
  cmd =
    "scanline -flatbed -a4 -resolution 100 -tiff -dir /tmp -name image && convert -quality 100 /tmp/image.tif /tmp/image.jpg" 

console.log(osName)
console.log(cmd)

var RateLimit = require("express-rate-limit");
var limiter = new RateLimit({
  windowMs: 5 * 1000, // 5 seconds
  max: 1, // limit each IP to 1 requests per windowMs
  delayMs: 0 // disable delaying - full speed until the max limit is reached
});

//  apply to all requests
app.use(limiter);

var fs = require("fs");

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.get("/scan/test", (req, res) => {
  // serve local image
  var base64str = base64_encode("image.jpg");
  res.send(base64str);
});

app.get("/scan/testImage", (req, res) => {
  res.sendFile("image.jpg");
});

app.get("/scan", (req, res) => {
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send(err);
    } else {
      var base64str = base64_encode("/tmp/image.jpg");
      res.send(base64str);
    }
  });
});

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
httpPort = 8899;
httpsPort = 8900;

httpServer.listen(httpPort);
httpsServer.listen(httpsPort);
// app.listen(port, function () {
//   console.log('Example app listening on port ' + port)
// })
