import { Queue, StreamDispatcher, Track } from "discord-player";
import { Message } from "discord.js";
import { musicChannel, play, player, updateMessage } from ".";

/**
 * Handles a message sent to the music channel.
 *
 * @param message The message
 */
export async function onMessageCreate(message: Message) {
    if (!(message.guild && message.channelId == musicChannel(message.guild).id))
        return;

    // Delete the message
    message.delete();

    const result = await player.search(message.content, {
        requestedBy: message.author,
    });
    try {
        play(message.member!, result);
    } catch (e) {
        console.error(e);
    }
}

/**
 * Handles a botDisconnect event.
 *
 * @param queue The queue
 */
export async function onBotDisconnect(queue: Queue) {
    console.warn("Bot disconnected");
    console.debug(queue);
    updateMessage(queue.guild);
}

/**
 * Handles a channelEmpty event.
 *
 * @param queue The queue
 */
export async function onChannelEmpty(queue: Queue) {
    console.warn("Channel empty");
    console.debug(queue);
    updateMessage(queue.guild);
}

export async function onConnectionCreate(
    queue: Queue,
    connection: StreamDispatcher
) {
    console.log("Connection created!");
    console.debug(queue, connection);
}

export async function onConnectionError(queue: Queue, error: Error) {
    console.error("Connection error!");
    console.error(error);
    console.debug(queue);
}

export async function onDebug(queue: Queue, message: String) {
    console.debug("Debug message:");
    console.debug(message);
    console.debug(queue);
}

export async function onError(queue: Queue, error: Error) {
    console.error("Error!");
    console.error(error);
    console.debug(queue);
}

/**
 * Handles a queueEnd event.
 *
 * @param queue The queue
 */
export async function onQueueEnd(queue: Queue) {
    console.log("Queue ended");
    console.debug(queue);
    updateMessage(queue.guild);
}

/**
 * Handles a trackAdd event.
 *
 * @param queue The queue
 * @param track The track
 */
export async function onTrackAdd(queue: Queue, track: Track) {
    console.log(
        `Track ${track.title} added (queue size: ${queue.tracks.length})`
    );
    console.debug(queue, track);
    updateMessage(queue.guild);
}

/**
 * Handles a tracksAdd event.
 *
 * @param queue The queue
 * @param tracks The tracks
 */
export async function onTracksAdd(queue: Queue, tracks: Track[]) {
    console.log(
        `Playlist with ${tracks.length} tracks added (queue size: ${queue.tracks.length})`
    );
    console.debug(queue, tracks);
    updateMessage(queue.guild);
}

/**
 * Handles a trackStart event.
 *
 * @param queue The queue
 * @param track The track
 */
export async function onTrackStart(queue: Queue, track: Track) {
    console.log(`Track ${track.title} started`);
    console.debug(queue, track);
    updateMessage(queue.guild);
}

export async function onTrackEnd(queue: Queue, track: Track) {
    console.log(`Track ${track.title} ended`);
    console.debug(queue, track);
}
