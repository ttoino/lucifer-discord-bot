import { Queue } from "discord-player";
import { MessageReaction } from "discord.js";
import { songsPerPage } from "./constants";

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
