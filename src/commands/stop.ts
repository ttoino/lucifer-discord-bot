import { Command } from "../Command";
import { stop as stopPlayer } from "../music";

const stop: Command = {
    description: "Pause current track",
    call: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.guild)
            return interaction.editReply("Something's wrong");

        stopPlayer(interaction.guild);
        interaction.editReply("Player stopped");
    },
};

export default stop;
