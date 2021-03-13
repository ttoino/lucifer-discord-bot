import { Queue } from "discord-player";
import { Message, MessageReaction } from "discord.js";
import { songsPerPage } from "./constants";

export async function connectToVoice(message: Message) {
    if (message.member?.voice.channel) {
        return await message.member.voice.channel.join();
    }
}

export function compareReactionEmoji(
    reaction: MessageReaction,
    emoji: string | string[]
) {
    if (typeof emoji == "string") return reaction.emoji.name == emoji;
    return emoji.includes(reaction.emoji.name);
}

export function queuePages(queue: Queue) {
    return Math.ceil((queue.tracks.length - 1) / songsPerPage);
}
