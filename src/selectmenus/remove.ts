import { Guild, SelectMenuInteraction } from "discord.js";
import { remove } from "../music";

export default async function (interaction: SelectMenuInteraction) {
    await interaction.deferUpdate();

    if (!(interaction.guild instanceof Guild))
        return interaction.editReply("Something's wrong");

    remove(interaction.guild, interaction.values);

    interaction.editReply({
        content: `**${interaction.values.length}** tracks removed from queue!`,
        components: [],
        embeds: [],
    });
}
