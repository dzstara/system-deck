require("dotenv-flow").config();

const Koa = require("koa");
const cors = require("@koa/cors");
const Router = require("@koa/router");
const serve = require("koa-static-server");
const WebSocket = require("ws");
const fs = require("fs");

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

console.log("Launching HTTP server on 8010");

app.listen(8010);

const wsServer = new WebSocket.Server({ port: 8020 });

console.log("Launching WebSocket server on 8020");

wsServer.on("connection", function connection(socket) {
  socket.on("message", function incoming(data) {
    wsServer.clients.forEach(function each(client) {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});
