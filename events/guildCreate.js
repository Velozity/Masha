/* eslint-disable class-methods-use-this */
const Trident = require("trident.js");
const { logger, prisma } = require("../config");
class GuildCreate extends Trident.Event {
  constructor() {
    super("guildCreate"); /** The strict name of the event */
  }

  async execute(guild) {
    logger.info("New Server Join", {
      id: guild.id,
      name: guild.name,
      memberCount: guild.memberCount,
    });

    await prisma.guild
      .create({
        data: {
          id: guild.id,
          Context: { create: {} },
        },
      })
      .catch((e) => e);
  }
}

module.exports = new GuildCreate();
