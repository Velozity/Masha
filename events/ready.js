/* eslint-disable class-methods-use-this */
const Trident = require("trident.js");
const { trident } = require("../config");
class Ready extends Trident.Event {
  constructor() {
    super("ready"); /** The strict name of the event */
  }

  async execute() {
    trident.cluster
      .broadcastEval(`this.guilds.size`)
      .then((results) =>
        console.log(
          `${results.reduce((prev, val) => prev + val, 0)} total guilds`
        )
      );
  }
}

module.exports = new Ready();
