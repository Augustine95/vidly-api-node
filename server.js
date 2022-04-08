const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/validation")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/prod")(app);

const port = process.env.PORT || 3000;
const server = app
  .listen(port, () => winston.info(`Listening on port ${port}...`))
  .on("error", () => {
    process.once("SIGUSR2", () => process.kill(process.pid, "SIGUSR2"));
    process.once("SIGINT", () => process.kill(process.pid, "SIGINT"));
    process.once("uncaughtException", () => winston.info("UNCAUGHT EXCEPTION"));
  });

module.exports = server;
