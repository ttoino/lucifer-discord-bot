import { Message } from "discord.js";

/**
 *
 */
export default interface Command {
    /** The name of the command. Used to call the command */
    name: string;

    /** The description of the command. Shown in the help command */
    description: string;

    /**
     * Called when the command is called
     *
     * @param message The message that called the command
     * @param args The arguments used when the command was called (does not include the command name)
     */
    call: (message: Message, ...args: string[]) => void;

    /**
     * If true the command can only be called by server administrators
     *
     * @default false
     */
    admin?: boolean;
}
