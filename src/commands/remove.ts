import { Command } from "../Command";
import { getQueue } from "../music";
import { removeMenuRow } from "../music/components";

const remove: Command = {
    description: "Remove tracks from the queue",
    call: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.inGuild())
            return interaction.editReply("Something's wrong");

        const queue = getQueue(interaction.guildId);

        interaction.editReply({
            content: "Choose which tracks to remove",
            components: [removeMenuRow(queue.tracks)],
        });
    },
};

export default remove;
