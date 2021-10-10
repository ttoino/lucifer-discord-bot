import { ButtonInteraction } from "discord.js";
import { firstPage } from "../music";

export default async function (interaction: ButtonInteraction) {
    firstPage(interaction.guild!);
    await interaction.reply("Paused");
    interaction.deleteReply();
}
