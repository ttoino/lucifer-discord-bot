import { Guild } from "discord.js";
import { Command } from "../Command";
import { shuffle as shuffleTracks } from "../music";

const shuffle: Command = {
    description: "Shuffle all tracks in the queue",
    call: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!(interaction.guild instanceof Guild))
            return interaction.editReply("Something's wrong");

        shuffleTracks(interaction.guild);
        interaction.editReply("Shuffled all tracks");
    },
};

export default shuffle;
