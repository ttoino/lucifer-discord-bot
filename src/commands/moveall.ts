import { admin, CommandWithOptions } from "../Command";
// import { SlashCommandBuilder } from "@discordjs/builders";
import { Channel, GuildMember, VoiceChannel } from "discord.js";

const options = {
    channel: {
        description: "O canal para o qual mover",
        type: Channel,
    },
} as const;

const moveall: CommandWithOptions<typeof options> = {
    admin,
    options,
    description: "Move todos os utilizadores no teu canal para outro canal",
    call: async (interaction, { channel }) => {
        if (!(channel instanceof VoiceChannel))
            return interaction.reply({
                content: "Esse canal não é um canal de voz!",
                ephemeral: true,
            });

        if (!(interaction.member instanceof GuildMember))
            return interaction.reply({
                content: "Something's wrong",
                ephemeral: true,
            });

        const oldChannel = interaction.member.voice.channel;
        if (!oldChannel)
            return interaction.reply({
                content: "Precisas de estar num canal de voz :imp:",
                ephemeral: true,
            });

        try {
            oldChannel.members.forEach((member) =>
                member.voice.setChannel(channel)
            );
            interaction.reply({ content: "Feito!", ephemeral: true });
        } catch (e) {
            console.error(e);
            interaction.reply({ content: "Houve um erro", ephemeral: true });
        }
    },
};

export default moveall;
