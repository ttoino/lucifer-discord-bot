import { ButtonInteraction } from "discord.js";
import { shuffle } from "../music";

export default async function (interaction: ButtonInteraction) {
    shuffle(interaction.guild!);
    await interaction.reply("Paused");
    interaction.deleteReply();
}
