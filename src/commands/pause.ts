import { Command } from "../Command";
import { pause as pausePlayer } from "../music";

const pause: Command = {
    // json: new SlashCommandBuilder()
    //     .setName("pause")
    //     .setDescription("Pause current track")
    //     .toJSON(),
    description: "Pause current track",
    call: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.guild)
            return interaction.editReply("Something's wrong");

        pausePlayer(interaction.guild);
        interaction.editReply("Track paused");
    },
};

export default pause;
