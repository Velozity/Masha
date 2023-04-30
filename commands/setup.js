const Trident = require("trident.js");
const OpenAIClient = require("../services/OpenAIClient");
const { prisma, constants } = require("../config");

class Setup extends Trident.Command {
  constructor() {
    super();

    this.name = "setup";
    this.description = "Setup Masha's OpenAI Key (admin only)";
    this.allowDms = false;
    this.type = Trident.Oceanic.ApplicationCommandTypes.CHAT_INPUT;
    this.options = [
      {
        name: "openai_key",
        description: "Your API key from OpenAI",
        type: Trident.Oceanic.ApplicationCommandOptionTypes.STRING,
        required: true,
      },
    ];
    this.defaultMemberPermissions = Trident.Oceanic.Permissions.ADMINISTRATOR;
  }

  /**
   * @param {Trident.Oceanic.AnyCommandInteraction} interaction Oceanic.js Interaction object
   * @param {Trident.Oceanic.User} user Oceanic.js User object
   * @param {Trident.Client} trident  An instance of the client
   * @returns {Promise<void>} Return empty promise to handle potential errors
   */
  async execute(interaction, user, trident) {
    if (interaction.guild.ownerID !== user.id) return;
    const openai_key =
      interaction.data.options.raw
        .find((v) => v.name === "openai_key")
        ?.value.trim() || null;

    if (!openai_key) {
      return interaction.createMessage({
        content:
          "Please provide a valid OpenAI key from https://platform.openai.com/account/api-keys",
        flags: 64, // Use the flag "64" see that only the person who interacted can see this message
      });
    }

    if (await new OpenAIClient(openai_key).validateKey()) {
      // valid
      const upsert = await prisma.connection
        .upsert({
          update: {
            providerKey: openai_key,
          },
          create: {
            // guildId: interaction.guild.id,
            provider: constants.providers.OpenAI,
            providerKey: openai_key,
            guild: {
              connectOrCreate: {
                create: {
                  id: interaction.guild.id,
                },
                where: { id: interaction.guild.id },
              },
            },
          },
          where: {
            guildId_provider: {
              guildId: interaction.guild.id,
              provider: constants.providers.OpenAI,
            },
          },
        })
        .catch((e) => e);

      if (upsert instanceof Error) {
        console.log(upsert);
        return interaction.createMessage({
          content: "Something went wrong, please try again soon.",
          flags: 64, // Use the flag "64" see that only the person who interacted can see this message
        });
      }
      return interaction.createMessage({
        content: `Masha is ready to go!
    Just tag her or mention her name along with a question.`,
        flags: 64, // Use the flag "64" see that only the person who interacted can see this message
      });
    } else {
      return interaction.createMessage({
        content:
          "Please provide a valid OpenAI key from https://platform.openai.com/account/api-keys",
        flags: 64, // Use the flag "64" see that only the person who interacted can see this message
      });
    }
  }
}

module.exports = new Setup();
