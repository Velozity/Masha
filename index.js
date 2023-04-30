const { ClusterManager } = require("discord-hybrid-sharding");
require("dotenv").config();

const manager = new ClusterManager(`./config/trident.js`, {
  totalShards: "auto",
  shardsPerClusters: 2,
  // totalClusters: 7,
  mode: "process", // you can also choose "worker"
  token: process.env.DISCORD_TOKEN,
});

manager.on("clusterCreate", (cluster) =>
  console.log(`Launched Cluster ${cluster.id}`)
);
manager.spawn({ timeout: -1 });
