const Trident = require("trident.js");

class Ping extends Trident.Command {
  constructor() {
    super();

    this.name = "ping";
    this.description = "Use me!";
    this.allowDms = true;
    this.guilds = null; // Global
    // this.guilds Must return NULL/Undefined for global command, string array or async function that returns string array.
    // this.guilds = async () => {
    //   // getGuildIdsFromDatabase();
    //   return null;
    // };
    this.type = Trident.Oceanic.ApplicationCommandTypes.CHAT_INPUT;
    // this.options = [
    //   {
    //     name: "prompt",
    //     description: "The prompt to generate",
    //     type: Trident.Oceanic.ApplicationCommandOptionTypes.STRING,
    //   },
    // ];
  }

  /**
   * @param {Trident.Oceanic.AnyCommandInteraction} interaction Oceanic.js Interaction object
   * @param {Trident.Oceanic.User} user Oceanic.js User object
   * @param {Trident.Client} trident  An instance of the client
   * @returns {Promise<void>} Return empty promise to handle potential errors
   */
  async execute(interaction, user, trident) {
    /** We received an interaction from our /ping command! Let's send a message back with some buttons
     * to execute out receiveInteraction and receiveAnotherInteraction functions below
     */

    console.log("[/commands/ping.js] You used /ping!");
    interaction.createMessage({
      content: "Text body!",
      components: [
        {
          type: Trident.Oceanic.ComponentTypes.ACTION_ROW,
          components: [
            {
              type: Trident.Oceanic.ComponentTypes.BUTTON,
              style: Trident.Oceanic.ButtonStyles.PRIMARY,
              label: "Test Interactions",
              customID:
                "receiveInteraction" /** ID MUST match EXACTLY the name of the function below */,
            },
            {
              type: Trident.Oceanic.ComponentTypes.BUTTON,
              style: Trident.Oceanic.ButtonStyles.SECONDARY,
              label: "Test Interactions 2",
              customID:
                "receiveAnotherInteraction" /** ID MUST match EXACTLY the name of the function below */,
            },
          ],
        },
      ],
      flags: 64 /** Flags 64 to restrict the viewing of this message to the person that used the command */,
    });
  }

  /**
   * @param {Trident.Oceanic.AnyCommandInteraction} interaction Oceanic.js Interaction object
   * @param {Trident.Oceanic.User} user Oceanic.js User object
   * @param {Trident.Client} trident  An instance of the client
   * @returns {Promise<void>} Return empty promise to handle potential errors
   */
  async receiveInteraction(interaction, user, trident) {
    console.log("[/commands/ping.js] Received interaction 1!");

    return interaction.createMessage({
      content: "Interaction 1 worked!",
      flags: 64, // Use the flag "64" see that only the person who interacted can see this message
    });
  }

  /**
   * @param {Trident.Oceanic.AnyCommandInteraction} interaction Oceanic.js Interaction object
   * @param {Trident.Oceanic.User} user Oceanic.js User object
   * @param {Trident.Client} trident  An instance of the client
   * @returns {Promise<void>} Return empty promise to handle potential errors
   */
  async receiveAnotherInteraction(interaction, user, trident) {
    console.log("[/commands/ping.js] Received interaction 2!");

    return interaction.createMessage({
      content: "Well whad'ya know, interaction 2 worked as well.",
      flags: 64, // Use the flag "64" see that only the person who interacted can see this message
    });
  }
}

module.exports = new Ping();
