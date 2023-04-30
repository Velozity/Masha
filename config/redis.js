/* eslint-disable no-console */
const Redis = require("ioredis");
const logger = require("./winston");

const client = new Redis.Redis({
  host: process.env.REDIS_IP || undefined,
  port: process.env.REDIS_PORT || undefined,
  password: process.env.REDIS_PW || undefined,
  db: 1,
});

client.on("ready", () => {
  console.log("Redis client is ready!");
});

client.on("error", (error) => {
  logger.log({ level: "error", message: error });
});

client.on("warning", (warning) => {
  logger.log({ level: "warn", message: warning });
});

module.exports = client;
