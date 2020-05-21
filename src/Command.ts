import { Message } from "discord.js";

export default interface Command {
    name: string,
    description: string,
    call: (message: Message, ...args: string[]) => void
}