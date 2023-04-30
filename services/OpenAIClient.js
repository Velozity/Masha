const { Configuration, OpenAIApi } = require("openai");
const { logger, constants } = require("../config");

class OpenAIClient {
  apiKey;
  openai;
  context;
  constructor(apiKey, context) {
    this.apiKey = apiKey;
    const configuration = new Configuration({
      apiKey,
    });
    this.openai = new OpenAIApi(configuration);
    this.context = context;
  }

  async validateKey() {
    return (await this.openai.listModels().catch((e) => e)).status === 200;
  }

  retrieveContext() {
    return {
      name: this.context?.name || constants.context.defaultContext.name,
      context:
        this.context?.context || constants.context.defaultContext.context,
      rules: this.context?.rules || constants.context.defaultContext.rules,
    };
  }

  async submitMessages(
    messages //: { content: string; role: "system" | "user" | "assistant" }[],
  ) {
    try {
      // generation
      console.time("start completion");
      const res = await this.openai.createChatCompletion({
        messages,
        model: "gpt-3.5-turbo",
        temperature: 0,
      });

      let fullResponse = res.data.choices[0].message.content;
      console.timeEnd("start completion");

      return {
        success: true,
        text: fullResponse.trim(),
      };
    } catch (err) {
      logger.error(err);
      return {
        error: "Something went wrong!",
      };
    }
  }
}

module.exports = OpenAIClient;
