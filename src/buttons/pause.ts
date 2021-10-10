import { ButtonInteraction } from "discord.js";
import { pause } from "../music";

export default async function (interaction: ButtonInteraction) {
    pause(interaction.guild!);
    await interaction.reply("Paused");
    interaction.deleteReply();
}
