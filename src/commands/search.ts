import { QueryType } from "discord-player";
import { GuildMember } from "discord.js";
import { CommandWithSubCommands } from "../Command";
import { player } from "../music";
import { searchMenuRow } from "../music/components";
import { searchEmbed } from "../music/embeds";

const options = {
    query: {
        description: "What to search for",
        type: "string",
    },
} as const;

const subcommands = {
    youtube: {
        description: "Search for tracks from Youtube",
        options,
    },
    soundcloud: {
        description: "Search for tracks from Soundcloud",
        options,
    },
} as const;

const search: CommandWithSubCommands<typeof subcommands> = {
    subcommands,
    description: "Search for tracks",
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

        return interaction.editReply({
            embeds: [searchEmbed(result.tracks)],
            components: [searchMenuRow(result)],
        });
    },
};

export default search;
