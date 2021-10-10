import { Player, Queue } from "discord-player";
import { MessageReaction } from "discord.js";
import { songsPerPage } from "./constants";

/**
 * Checks if a reaction's emoji is the same as another emoji or is in a list of emoji.
 *
 * @param reaction The reaction to the message
 * @param emoji The emoji
 * @returns true if the reaction's emoji is the same as emoji (or is in emoji)
 */
export function compareReactionEmoji(
    reaction: MessageReaction,
    emoji: string | string[]
) {
    if (!reaction.emoji.name) return false;
    else if (typeof emoji == "string") return reaction.emoji.name == emoji;
    return emoji.includes(reaction.emoji.name);
}

/**
 * Convenience method to calculate the number of pages a queue occupies.
 *
 * @param queue The queue
 * @returns The number of pages
 */
export function queuePages(queue: Queue) {
    return Math.ceil(queue.tracks.length / songsPerPage);
}

/**
 * Convenience method to wait some amount of time in async functions.
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

/**
 * Formats time to be in the format hours:minutes:seconds.
 * Each part is omitted automatically or padded with a leading zero if necessary.
 *
 * @param time The time in seconds
 * @returns The formatted time
 */
export function formatTime(time: number) {
    const hours = time > 3600 ? Math.floor(time / 3600) : "";
    const minutes = time > 60 ? Math.floor((time % 3600) / 60) : "";
    const seconds = Math.floor(time % 60);

    return (
        hours +
        (hours && minutes ? ":" + minutes.pad(2) : minutes.toString()) +
        (minutes ? ":" + seconds.pad(2) : seconds)
    );
}

declare global {
    interface Number {
        /**
         * Pads out a number so it has leading zeros
         *
         * @param length Length of the resulting string
         */
        pad(length: number): string;
    }
}

Number.prototype.pad = function (length) {
    return this.toString().padStart(length, "0");
};

// TYPES

export type AsyncReturnType<T extends (...args: any) => any> = T extends (
    ...args: any
) => Promise<infer U>
    ? U
    : T extends (...args: any) => infer U
    ? U
    : any;

export type SearchResults = AsyncReturnType<Player["search"]>;

export type PagedQueue = Queue<number>;
