import Command from "../Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember, VoiceChannel } from "discord.js";

const moveall: Command = {
    builder: new SlashCommandBuilder()
        .setName("moveall")
        .setDescription(
            "Move todos os utilizadores no teu canal para outro canal"
        )
        .addChannelOption((option) =>
            option
                .setName("canal")
                .setDescription("O canal para o qual mover")
                .setRequired(true)
        ),
    admin: true,
    call: async (interaction) => {
        const newChannel = interaction.options.getChannel("canal");

        if (!(newChannel instanceof VoiceChannel))
            return interaction.reply({
                content: "Esse canal não é um canal de voz!",
                ephemeral: true,
            });

        if (!(interaction.member instanceof GuildMember))
            return interaction.reply({
                content: "Something's wrong",
                ephemeral: true,
            });

        const channel = interaction.member.voice.channel;
        if (!channel)
            return interaction.reply({
                content: "Precisas de estar num canal de voz :imp:",
                ephemeral: true,
            });

        try {
            channel.members.forEach((member) =>
                member.voice.setChannel(newChannel)
            );
            interaction.reply({ content: "Feito!", ephemeral: true });
        } catch (e) {
            console.error(e);
            interaction.reply({ content: "Houve um erro", ephemeral: true });
        }
    },
};

export default moveall;
