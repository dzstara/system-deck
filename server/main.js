require("dotenv-flow").config();

const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("@koa/router");
const serve = require("koa-static-server");
const WebSocket = require("ws");
const fs = require("fs");
const io = require("socket.io-client");

const soundboardPath = process.env.SOUNDBOARD_PATH;

const app = new Koa();
const router = new Router();

router.get("/soundboard/", async (ctx) => {
  const files = fs.readdirSync(soundboardPath);

  ctx.body = files;
});

app
  .use(cors())
  .use(serve({ rootDir: soundboardPath, rootPath: "/soundboard/static" }))
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8010);

console.log("Launched HTTP server on 8010");

const wsServer = new WebSocket.Server({ port: 8020 });

function sendToAllClients(data, exceptSocket) {
  wsServer.clients.forEach(function each(client) {
    if (
      (exceptSocket === undefined || client !== exceptSocket) &&
      client.readyState === WebSocket.OPEN
    ) {
      client.send(data);
    }
  });
}

wsServer.on("connection", function connection(socket) {
  socket.on("message", function incoming(data) {
    sendToAllClients(data);
  });
});

console.log("Launched WebSocket server on 8020");

const socketToken = process.env.STREAMLABS_SOCKET_TOKEN;

async function connect() {
  const streamlabs = io(`https://sockets.streamlabs.com?token=${socketToken}`, {
    transports: ["websocket"],
  });

  console.log("Opening connection to StreamLabs...");

  return new Promise((resolve, reject) => {
    streamlabs.on("connect", () => {
      resolve(streamlabs);
    });

    streamlabs.on("connect_error", reject);
  });
}

connect()
  .then((streamlabs) => {
    console.log("Connected to StreamLabs");
    streamlabs.on("event", (...data) => {
      sendToAllClients(
        JSON.stringify({
          type: "StreamLabsEvent",
          data,
        })
      );
    });
  })
  .catch((err) => {
    console.error("error", err);
  });
