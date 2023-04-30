const { prisma } = require("../config");
const OpenAIClient = require("../services/OpenAIClient");

async function retrieveGuildOpenAIClient(guildId) {
  const result = await prisma.guild
    .findUnique({
      where: {
        id: guildId,
      },
      select: {
        id: true,
        Connection: {
          where: {
            provider: "openai",
          },
          select: {
            providerKey: true,
          },
        },
        Context: {
          select: {
            name: true,
            context: true,
            rules: true,
          },
        },
      },
    })
    .catch((e) => e);

  if (result instanceof Error || !result.id) {
    await prisma.guild.create({ data: { id: guildId } }).catch((e) => e);
    return null;
  }

  return result.Connection[0]?.providerKey
    ? new OpenAIClient(result.Connection[0]?.providerKey, result.Context)
    : null;
}

module.exports = {
  retrieveGuildOpenAIClient,
};
