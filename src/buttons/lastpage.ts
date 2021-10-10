import { ButtonInteraction } from "discord.js";
import { lastPage } from "../music";

export default async function (interaction: ButtonInteraction) {
    lastPage(interaction.guild!);
    await interaction.reply("Paused");
    interaction.deleteReply();
}
