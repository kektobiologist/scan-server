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

const exec = require("child_process").exec;

const filePath = "C:\\Downloads\\image.jpg";
const cmd = '\"C:\\Program\ Files\ (x86)\\NAPS2\\NAPS2.Console.exe\" -f -o ' + filePath

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
  var base64str = base64_encode(filePath);
  res.send(base64str);
});

app.get("/scan/testImage", (req, res) => {
  res.sendFile(filePath);
});

app.get("/scan", (req, res) => {
  // delete existing file if any
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send(err);
    } else {
      // var base64str = base64_encode("/tmp/image.jpg");
      var base64str = base64_encode(filePath);
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
