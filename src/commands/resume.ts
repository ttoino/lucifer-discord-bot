import { Command } from "../Command";
import { resume as resumePlayer } from "../music";

const resume: Command = {
    // json: new SlashCommandBuilder()
    //     .setName("resume")
    //     .setDescription("Resume current track")
    //     .toJSON(),
    description: "Resume current track",
    call: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });

        if (!interaction.guild)
            return interaction.editReply("Something's wrong");

        resumePlayer(interaction.guild);
        interaction.editReply("Track resumed");
    },
};

export default resume;
