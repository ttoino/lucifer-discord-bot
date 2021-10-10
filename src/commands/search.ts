import { QueryType } from "discord-player";
// import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildMember } from "discord.js";
import { CommandWithSubCommands } from "../Command";
import { player, search as searchFor } from "../music";

const options = {
    query: {
        description: "What to search for",
        type: String,
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

        return interaction.editReply(
            searchFor(/*(await interaction.fetchReply()).id*/ "", result)
        );
    },
};

export default search;
