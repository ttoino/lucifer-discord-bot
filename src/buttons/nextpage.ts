import { ButtonInteraction } from "discord.js";
import { nextPage } from "../music";

export default async function (interaction: ButtonInteraction) {
    nextPage(interaction.guild!);
    await interaction.reply("Paused");
    interaction.deleteReply();
}
