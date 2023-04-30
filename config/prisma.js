const { PrismaClient } = require("@prisma/client");
const { createPrismaRedisCache } = require("prisma-redis-middleware");

const prisma = new PrismaClient();

const cacheMiddleware = createPrismaRedisCache({
  models: [
    {
      model: "Guild",
      cacheTime: 1800,
      invalidateRelated: ["Context", "Connection", "Guild"],
    },
    { model: "Connection", cacheTime: 1800 },
    { model: "Context", cacheTime: 1800, invalidateRelated: ["Guild"] },
  ],
  storage: { type: "memory", options: { invalidation: true, log: undefined } },
  cacheTime: 300,
});

prisma.$use(cacheMiddleware);
module.exports = prisma;
