import { GuildMember, SelectMenuInteraction } from "discord.js";
import { play, player } from "../music";

export default async function (interaction: SelectMenuInteraction) {
    interaction.deferUpdate();

    if (!(interaction.member instanceof GuildMember))
        return interaction.editReply("Something's wrong");

    const results = await player.search(interaction.values[0], {
        requestedBy: interaction.user,
    });

    play(interaction.member, results);

    interaction.editReply({
        content: `Track **${results.tracks[0].title}** added to queue!`,
        components: [],
        embeds: [],
    });
}
