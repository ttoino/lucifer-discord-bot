import { ButtonInteraction } from "discord.js";
import { nextSong } from "../music";

export default async function (interaction: ButtonInteraction) {
    nextSong(interaction.guild!);
    await interaction.reply("Paused");
    interaction.deleteReply();
}
