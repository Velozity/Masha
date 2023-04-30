const { redis } = require("../config");
const { encode } = require("gpt-3-encoder");
async function retrieveMessages(channelId) {
  //await redis.del(`msgs:${channelId}`);
  return await redis
    .lrange(`msgs:${channelId}`, 0, process.env.AI_MAX_MESSAGES)
    .then((r) => {
      return r.map((r2) => JSON.parse(r2)).reverse();
    });
}

async function storeMessage(channelId, message, isHuman) {
  await redis.lpush(
    `msgs:${channelId}`,
    JSON.stringify({ role: isHuman ? "user" : "assistant", content: message })
  );
  redis.ltrim(`msgs:${channelId}`, 0, process.env.AI_MAX_MESSAGES);
  redis.expire(`msgs:${channelId}`, Number(process.env.AI_MSG_MEMORY) * 60000);

  return true;
}

function reduceMessages(messages) {
  const MAX_TOKENS = Number(process.env.AI_MAX_TOKENS);

  let tokenCount = 0;
  let reducedMessages = [];

  const systemMessages = messages.filter((m) => m.role === "system");
  // Total up system tokens
  for (let i = 0; i < systemMessages.length; i++) {
    const messageTokens = encode(systemMessages[i].content).length;
    tokenCount += messageTokens;
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    if (message.role === "system") continue;
    const messageTokens = encode(message.content).length;

    if (tokenCount + messageTokens > MAX_TOKENS) {
      break;
    }

    tokenCount += messageTokens;
    reducedMessages.unshift(message);
  }

  reducedMessages.unshift(...systemMessages);
  return { messages: reducedMessages, usedTokens: tokenCount };
}

module.exports = {
  storeMessage,
  retrieveMessages,
  reduceMessages,
};
