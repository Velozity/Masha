const Trident = require("trident.js");
const OpenAIClient = require("../services/OpenAIClient");
const { constants, prisma } = require("../config");
const { retrieveGuildOpenAIClient } = require("../utils/Guilds");

class Context extends Trident.Command {
  constructor() {
    super();

    this.name = "context";
    this.description = "Setup Masha's Context (admin only)";
    this.allowDms = false;
    this.type = Trident.Oceanic.ApplicationCommandTypes.CHAT_INPUT;
    // this.options = [
    //   {
    //     name: "openai_key",
    //     description: "Your API key from OpenAI",
    //     type: Trident.Oceanic.ApplicationCommandOptionTypes.STRING,
    //     required: true,
    //   },
    // ];
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

    const guildOpenAIClient = await retrieveGuildOpenAIClient(
      interaction.guild.id
    );
    const context = guildOpenAIClient
      ? guildOpenAIClient.retrieveContext()
      : constants.context.defaultContext;

    return interaction.createModal({
      customID: "onSetupModal",
      title: "Masha's Context Setup",
      components: [
        {
          type: Trident.Oceanic.ComponentTypes.ACTION_ROW,
          components: [
            {
              customID: "name",
              style: Trident.Oceanic.TextInputStyles.SHORT,
              type: Trident.Oceanic.ComponentTypes.TEXT_INPUT,
              label: "Name:",
              minLength: 3,
              maxLength: constants.context.nameMaxLength,
              value: context.name,
            },
          ],
        },
        {
          type: Trident.Oceanic.ComponentTypes.ACTION_ROW,
          components: [
            {
              customID: "context",
              style: Trident.Oceanic.TextInputStyles.PARAGRAPH,
              type: Trident.Oceanic.ComponentTypes.TEXT_INPUT,
              label: "Context:",
              minLength: 10,
              maxLength: constants.context.contextMaxLength,
              value: context.context,
            },
          ],
        },
        {
          type: Trident.Oceanic.ComponentTypes.ACTION_ROW,
          components: [
            {
              customID: "rules",
              style: Trident.Oceanic.TextInputStyles.PARAGRAPH,
              type: Trident.Oceanic.ComponentTypes.TEXT_INPUT,
              label: "Rules:",
              minLength: 10,
              maxLength: constants.context.rulesMaxLength,
              value: context.rules,
            },
          ],
        },
      ],
    });
  }

  async onSetupModal(interaction, user) {
    const data = interaction.data.components.flatMap((c) =>
      c.components.map((c) => {
        return { customID: c.customID, value: c.value };
      })
    );
    const newContext = {
      name: data.find((c) => c.customID === "name").value,
      context: data.find((c) => c.customID === "context").value,
      rules: data.find((c) => c.customID === "rules").value,
    };

    if (newContext.name.length > constants.context.nameMaxLength) return;
    if (newContext.context.length > constants.context.contextMaxLength) return;
    if (newContext.rules.length > constants.context.rulesMaxLength) return;

    try {
      await prisma.context.upsert({
        update: newContext,
        create: {
          ...newContext,
          guildId: interaction.guild.id,
        },
        where: { guildId: interaction.guild.id },
      });

      return interaction.createMessage({
        content: `${newContext.name}'s context has been updated.`,
        flags: 64,
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new Context();
