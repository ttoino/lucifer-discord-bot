import { ButtonInteraction } from "discord.js";
import { previousPage } from "../music";

export default async function (interaction: ButtonInteraction) {
    previousPage(interaction.guild!);
    await interaction.reply("Paused");
    interaction.deleteReply();
}
