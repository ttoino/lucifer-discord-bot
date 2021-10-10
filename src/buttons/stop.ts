import { ButtonInteraction } from "discord.js";
import { stop } from "../music";

export default async function (interaction: ButtonInteraction) {
    stop(interaction.guild!);
    await interaction.reply("Paused");
    interaction.deleteReply();
}
