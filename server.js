import http from "http";
import app from "./app.js";
import logger from "./startup/logger.js";

// SERVER
const server = http.createServer(app);
// PORT
const port = process.env.API_PORT || 3030;
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Common listener callback functions
 */
function onError(err) {
  logger.log(
    "error",
    `Express failed to listen on port ${this.address().port} ...`,
    err.stack
  );
}
function onListening() {
  logger.log("info", `Express is listening on port ${this.address().port} ...`);
}
