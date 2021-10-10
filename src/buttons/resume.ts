import { ButtonInteraction } from "discord.js";
import { resume } from "../music";

export default async function (interaction: ButtonInteraction) {
    resume(interaction.guild!);
    await interaction.reply("Resumed");
    interaction.deleteReply();
}
