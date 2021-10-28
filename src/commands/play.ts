import { CommandWithSubCommands } from "../Command";
import { musicChannel, play as playTrack, player } from "../music";
import { GuildMember } from "discord.js";
import { QueryType } from "discord-player";

const subcommands = {
    auto: {
        description: "Play a track from Youtube or a link",
        options: {
            query: {
                description: "A link, or what to search for",
                type: "string",
            },
        },
    },
    soundcloud: {
        description: "Play a track from Soundcloud",
        options: {
            query: {
                description: "What to search for",
                type: "string",
            },
        },
    },
} as const;

const play: CommandWithSubCommands<typeof subcommands> = {
    subcommands,
    description: "Play a track",
    call: async (interaction, subcommand, { query }) => {
        await interaction.deferReply({ ephemeral: true });

        if (!(interaction.member instanceof GuildMember))
            return interaction.editReply("Something's wrong");

        const result = await player.search(query, {
            requestedBy: interaction.user,
            searchEngine:
                subcommand == "soundcloud"
                    ? QueryType.SOUNDCLOUD_TRACK
                    : QueryType.AUTO,
        });
        playTrack(interaction.member, result);

        return interaction.editReply(
            `Check ${musicChannel(interaction.guild!)}`
        );
    },
};

export default play;
