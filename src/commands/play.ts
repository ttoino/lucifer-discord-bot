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
                type: String,
            },
        },
    },
    soundcloud: {
        description: "Play a track from Soundcloud",
        options: {
            query: {
                description: "What to search for",
                type: String,
            },
        },
    },
} as const;

const play: CommandWithSubCommands<typeof subcommands> = {
    // json: new SlashCommandBuilder()
    //     .setName("play")
    //     .setDescription("Play a track")
    //     .addSubcommand((builder) =>
    //         builder
    //             .setName("auto")
    //             .setDescription("Play a track from Youtube or a link")
    //             .addStringOption((option) =>
    //                 option
    //                     .setName("query")
    //                     .setDescription("Link, or what to search for")
    //                     .setRequired(true)
    //             )
    //     )
    //     .addSubcommand((builder) =>
    //         builder
    //             .setName("soundcloud")
    //             .setDescription("Play a track from Soundcloud")
    //             .addStringOption((option) =>
    //                 option
    //                     .setName("query")
    //                     .setDescription("What to search for")
    //                     .setRequired(true)
    //             )
    //     )
    //     .toJSON(),
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
