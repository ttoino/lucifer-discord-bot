import { Guild, SelectMenuInteraction } from "discord.js";
import { setRepeatMode, updateMessage } from "../music";

export default async function (interaction: SelectMenuInteraction) {
    await interaction.deferReply({ ephemeral: true });

    if (!(interaction.guild instanceof Guild))
        return interaction.editReply("Something's wrong");

    setRepeatMode(interaction.guild, Number.parseInt(interaction.values[0]));
    updateMessage(interaction.guild);
    interaction.editReply("Set repeat mode");
}
