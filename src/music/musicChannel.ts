import { Playlist, Queue, Track } from "discord-player";
import {
    Channel,
    Client,
    Message,
    MessageCollector,
    MessageEmbed,
    TextChannel,
} from "discord.js";
import {
    dislike,
    loop,
    nextPage,
    nextSong,
    numberEmoji,
    playPause,
    previousPage,
    shuffle,
    stop,
} from "../constants";
import { compareReactionEmoji, queuePages, wait } from "../util";
import { helpEmbed, playEmbed, queueEmbed, searchEmbed } from "./embeds";
import { player } from "./player";

/** The music channel */
export let channel: TextChannel;

/** The message that shows the current track */
let playingMessage: Message;

/** The message that shows the queue */
let queueMessage: Message;

/** Which page of the queue to show */
let queuePage = 0;

/** The message that shows the help */
let helpMessage: Message;

/**
 * Initializes the music channel.
 *
 * @param client The client
 */
export async function startMusicChannel(client: Client) {
    // Set channel variable
    channel = client.channels.cache.get(
        process.env.BOT_CHANNEL!
    ) as TextChannel;

    // Delete old messages
    const messages = await channel.messages.fetch({ limit: 100 });
    channel.bulkDelete(messages);

    // Set channel topic
    channel.setTopic(
        "Escreve o nome ou link de uma música para a tocar!\nEscreve um **?** para ver mais opções!"
    );

    // Send new messages
    updateMessages();
}

/**
 * Sends the playingMessage to the music channel and adds reactions.
 *
 * @param embed The playing embed
 */
async function sendPlaying(embed: MessageEmbed) {
    // Send message
    playingMessage = await channel.send(embed);

    // Add reactions
    [playPause, stop, loop, nextSong].forEach((e) =>
        playingMessage.react(e).catch(console.error)
    );

    // Handle reactions
    playingMessage
        .createReactionCollector(
            // Ignore own reactions
            (reaction, user) => user != playingMessage.author
        )
        .on("collect", (reaction, user) => {
            try {
                switch (reaction.emoji.name) {
                    // Toggle track playing/paused
                    case playPause:
                        player.getQueue(playingMessage).paused
                            ? player.resume(playingMessage)
                            : player.pause(playingMessage);
                        updatePlaying(player.getQueue(playingMessage));
                        break;
                    // Stop music playing
                    case stop:
                        player.stop(playingMessage);
                        updateMessages();
                        break;
                    // Toggle repeat current track
                    case loop:
                        const queue = player.getQueue(playingMessage);
                        player.setRepeatMode(playingMessage, !queue.repeatMode);
                        updatePlaying(queue);
                        break;
                    // Skip current track
                    case nextSong:
                        player.skip(playingMessage);
                        break;
                }
            } catch (e) {
                // Print errors
                console.error(e);
            } finally {
                // Delete reaction
                reaction.users.remove(user);
            }
        });
}

/**
 * Edits playingMessage with new information, sends it if it doesn't exist.
 *
 * @param queue The queue
 */
function updatePlaying(queue: Queue | undefined) {
    const pe = playEmbed(queue);

    if (playingMessage && !playingMessage.deleted) playingMessage.edit(pe);
    else sendPlaying(pe);
}

/**
 * Sends the queueMessage to the music channel and adds reactions.
 *
 * @param embed The queue embed
 */
async function sendQueue(embed: MessageEmbed) {
    queueMessage = await channel.send(embed);

    [loop, shuffle, previousPage, nextPage].forEach((e) =>
        queueMessage.react(e).catch(console.error)
    );
    queueMessage
        .createReactionCollector(
            (reaction, user) => user != queueMessage.author
        )
        .on("collect", (reaction, user) => {
            try {
                const queue = player.getQueue(queueMessage);
                switch (reaction.emoji.name) {
                    case shuffle:
                        updateQueue(player.shuffle(queueMessage));
                        break;
                    case loop:
                        player.setLoopMode(playingMessage, !queue.loopMode);
                        updateQueue(queue);
                        break;
                    case previousPage:
                        if (queuePage > 0) updateQueue(queue, --queuePage);
                        break;
                    case nextPage:
                        if (queuePage < queuePages(queue) - 1)
                            updateQueue(queue, ++queuePage);
                        break;
                }
            } catch (e) {
                console.error(e);
            } finally {
                reaction.users.remove(user);
            }
        });
}

/**
 * Edits queueMessage with new information, sends it if it doesn't exist.
 *
 * @param queue The queue
 * @param page Which page to show
 */
async function updateQueue(queue: Queue | undefined, page = 0) {
    queuePage = page;
    const qe = queueEmbed(queue, page);

    if (queueMessage && !queueMessage.deleted) queueMessage.edit(qe);
    else sendQueue(qe);
}

/**
 * Edits messages with new information, sends them if they don't exist.
 *
 * @param queue The queue
 */
function updateMessages() {
    //@ts-ignore
    const queue = player.getQueue({ guild: { id: channel.guild.id } });

    updatePlaying(queue);
    updateQueue(queue);
}

/**
 * Sends the helpMessage if it doesn't exist, then deletes it after a minute.
 */
async function sendHelp() {
    if (!helpMessage || helpMessage.deleted) {
        helpMessage = await channel.send(helpEmbed);

        helpMessage.delete({ timeout: 60000 });
    }
}

/**
 * Checks if a channel is the music channel.
 *
 * @param c The channel
 * @returns true if the channel is the music channel
 */
export function isMusicChannel(c: Channel) {
    return c == channel;
}

/**
 * Parses track indices and removes them from the queue.
 *
 * @param message The message that requested the remove
 * @param content The indices
 */
function removeFromQueue(message: Message, content: string) {
    // Use a set so there are no duplicates
    const indices: Set<number> = new Set();
    const queue = player.getQueue(message);

    // Separate the indices
    content
        .trim()
        .split(/[\s,.;:]+/)
        .forEach((s) => {
            const n = parseInt(s);
            if (n > 0 && n < queue?.tracks.length) indices.add(n);
        });

    // Remove tracks in descending order of indices
    Array.from(indices)
        .sort((a, b) => b - a)
        .forEach((n) => player.remove(message, n));

    // Update queueMessage
    updateQueue(queue);
}

// EVENTS
/**
 * Handles a message sent to the music channel.
 *
 * @param message The message
 */
export async function onMusicChannelMessage(message: Message) {
    // Delete the message
    message.delete();

    // Separate prefix and the rest of the message
    const start = message.content[0];
    const rest = message.content.substring(1);

    switch (start) {
        // Remove tracks
        case "-":
            removeFromQueue(message, rest);
            break;
        // Search (or help)
        case "?":
            if (rest) await player.play(message, rest, false);
            else sendHelp();
            break;
        // Play
        default:
            await player.play(message, message.content, true);
            break;
    }
}

/**
 * Handles a trackStart event.
 *
 * @param message The message
 * @param track The track
 */
export function onTrackStart(message: Message, track: Track) {
    console.log(`Track ${track.title} started`);
    updateMessages();
}

/**
 * Handles a trackAdd event.
 *
 * @param message The message
 * @param queue The queue
 * @param track The track
 */
export function onTrackAdd(message: Message, queue: Queue, track: Track) {
    console.log(
        `Track ${track.title} added (queue size: ${queue.tracks.length})`
    );
    updateQueue(queue);
}

/**
 * Handles a playlistAdd event.
 *
 * @param message The message
 * @param queue The queue
 * @param playlist The playlist
 */
export function onPlaylistAdd(
    message: Message,
    queue: Queue,
    playlist: Playlist
) {
    console.log(
        `Playlist with ${playlist.tracks.length} tracks added (queue size: ${queue.tracks.length})`
    );
    updateQueue(queue);
}

/**
 * Handles a queueCreate event.
 *
 * @param message The message
 * @param queue The queue
 */
export async function onQueueCreate(message: Message, queue: Queue) {
    // Need this because this event is sent before the queue actually gets populated
    await wait(50);
    console.log(`Queue with ${queue.tracks.length} tracks created`);
    updateQueue(queue);
}

/**
 * Handles a queueEnd event.
 *
 * @param message The message
 * @param queue The queue
 */
export function onQueueEnd(message: Message, queue: Queue) {
    console.log("Queue ended");
    updateMessages();
}

/**
 * Handles a searchResults event.
 *
 * @param message The message
 * @param query The query
 * @param tracks The tracks
 * @param collector The collector
 */
export async function onSearchResults(
    message: Message,
    query: string,
    tracks: Track[],
    collector: MessageCollector
) {
    console.log("Search results received");

    // Stop default track choice handler
    collector.stop();

    // Send message with search results
    const m = await channel.send(searchEmbed(tracks));

    try {
        // Add reactions
        [...numberEmoji, dislike].forEach((e) => m.react(e).catch(() => null));

        // Handle reactions
        const r = await m.awaitReactions(
            (reaction, user) =>
                user == message.author &&
                compareReactionEmoji(reaction, [...numberEmoji, dislike]),
            {
                max: 1,
                time: 60000,
                errors: ["time"],
            }
        );
        const reaction = r.array()[0];

        if (!compareReactionEmoji(reaction, dislike)) {
            // Emulate sending track choice through default method
            collector.emit("collect", {
                content: numberEmoji.indexOf(reaction.emoji.name) + 1,
            });
        }
    } catch (e) {
        // Print errors
        console.error(e);
    } finally {
        // Delete results message
        m.delete();
    }
}

/**
 * Handles a botDisconnect event.
 *
 * @param message The message
 */
export async function onBotDisconnect(message: Message) {
    console.warn("Bot disconnected");
    updateMessages();
}

/**
 * Handles a channelEmpty event.
 *
 * @param message The message
 */
export async function onChannelEmpty(message: Message) {
    console.warn("Channel empty");
    updateMessages();
}
