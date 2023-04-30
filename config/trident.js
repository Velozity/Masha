const Trident = require("trident.js");
const { ClusterClient, getInfo } = require("discord-hybrid-sharding");

const tridentClient = new Trident.TridentClient({
  token:
    process.env
      .DISCORD_TOKEN /** Create a bot and generate a token to put here, https://discord.com/developers/applications */,

  intents: [
    "GUILD_PRESENCES",
    "GUILD_MESSAGES",
    "GUILD_MEMBERS",
    "MESSAGE_CONTENT",
    "GUILDS",
    "DIRECT_MESSAGES",
    "GUILD_INTEGRATIONS",
  ] /** Modify to your bots requirements */,
  oceanicOptions: {
    gateway: {
      shardIDs: getInfo().SHARD_LIST,
      maxShards: getInfo().TOTAL_SHARDS,
    },
  },
});

tridentClient.cluster = new ClusterClient(tridentClient);

module.exports = tridentClient;
