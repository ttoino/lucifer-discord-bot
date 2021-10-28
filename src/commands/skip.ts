import { Command } from "../Command";
import { nextSong } from "../music";

const skip: Command = {
    description: "Skip to the next song",
    call: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.guild)
            return interaction.editReply("Something's wrong!");

        nextSong(interaction.guild);

        return interaction.editReply(`Skipped song!`);
    },
};

export default skip;
