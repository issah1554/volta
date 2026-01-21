// https-proxy.js
const fs = require("fs");
const https = require("https");
const httpProxy = require("http-proxy");

const target = "http://localhost:3000"; // Next.js dev server

const proxy = httpProxy.createProxyServer({
  target,
  changeOrigin: true,
});

const server = https.createServer(
  {
    key: fs.readFileSync("./.certs/192.168.1.12-key.pem"),
    cert: fs.readFileSync("./.certs/192.168.1.12.pem"),
  },
  (req, res) => {
    proxy.web(req, res);
  }
);

server.listen(3443, "0.0.0.0", () => {
  console.log("HTTPS proxy at https://192.168.1.12:3443 ->", target);
});
