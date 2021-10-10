import { QueueRepeatMode } from "discord-player";
import { CommandWithSubCommands } from "../Command";
import { setRepeatMode, updateMessage } from "../music";

const subcommands = {
    off: {
        description: "Don't repeat",
        options: {},
    },
    autoplay: {
        description: "Autoplay new tracks",
        options: {},
    },
    track: {
        description: "Repeat current track",
        options: {},
    },
    queue: {
        description: "Repeat whole queue",
        options: {},
    },
};

const repeat: CommandWithSubCommands<typeof subcommands> = {
    subcommands,
    description: "Set the repeat mode",
    call: async (interaction, subcommand) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.guild)
            return interaction.editReply("Something's wrong");

        setRepeatMode(
            interaction.guild,
            QueueRepeatMode[
                subcommand.toUpperCase() as Uppercase<typeof subcommand>
            ]
        );
        updateMessage(interaction.guild);
        interaction.editReply("Set repeat mode");
    },
};

export default repeat;
