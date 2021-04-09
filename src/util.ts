import { Queue } from "discord-player";
import { MessageReaction } from "discord.js";
import { songsPerPage } from "./constants";

/**
 * Cheks if a reaction's emoji is the same as another emoji or is in a list of emoji.
 *
 * @param reaction The reaction to the message
 * @param emoji The emoji
 * @returns true if the reaction's emoji is the same as emoji (or is in emoji)
 */
export function compareReactionEmoji(
    reaction: MessageReaction,
    emoji: string | string[]
) {
    if (typeof emoji == "string") return reaction.emoji.name == emoji;
    return emoji.includes(reaction.emoji.name);
}

/**
 * Convenience method to calculate the number of pages a queue occupies.
 *
 * @param queue The queue
 * @returns The number of pages
 */
export function queuePages(queue: Queue) {
    return Math.ceil((queue.tracks.length - 1) / songsPerPage);
}

/**
 * Convinience method to wait some ammount of time in async functions.
 *
 * @example <caption>Waits for 10 seconds</caption>
 * await wait(10000);
 *
 * @param time Time in milliseconds
 * @returns A promise resolved after the wait is over
 */
export function wait(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
