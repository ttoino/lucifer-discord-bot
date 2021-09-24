import { CommandInteraction } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

/**
 *
 */
export default interface Command {
    builder: Partial<SlashCommandBuilder>;

    /**
     * Called when the command is called
     *
     * @param interaction The interaction associated with the command
     */
    call: (interaction: CommandInteraction) => void;

    /**
     * If true the command can only be called by server administrators
     *
     * @default false
     */
    admin?: boolean;
}
