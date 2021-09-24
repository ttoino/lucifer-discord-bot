import { Queue, QueueRepeatMode, Track } from "discord-player";
import {
    Client,
    Message,
    MessageEmbed,
    TextBasedChannels,
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
import { compareReactionEmoji, queuePages } from "../util";
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
    channel = (await client.channels.fetch(
        process.env.BOT_CHANNEL!
    )) as TextChannel;

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
    playingMessage = await channel.send({
        embeds: [embed],
    });

    // Add reactions
    [playPause, stop, loop, nextSong].forEach((e) =>
        playingMessage.react(e).catch(console.error)
    );

    // Handle reactions
    playingMessage
        .createReactionCollector(
            // Ignore own reactions
            { filter: (reaction, user) => user != playingMessage.author }
        )
        .on("collect", (reaction, user) => {
            const queue = player.getQueue(channel.guild);
            try {
                switch (reaction.emoji.name) {
                    // Toggle track playing/paused
                    case playPause:
                        queue.setPaused(!queue.connection.paused);
                        updatePlaying(queue);
                        break;
                    // Stop music playing
                    case stop:
                        queue.stop();
                        updateMessages();
                        break;
                    // Toggle repeat current track
                    case loop:
                        queue.setRepeatMode(
                            queue.repeatMode == QueueRepeatMode.TRACK
                                ? QueueRepeatMode.OFF
                                : QueueRepeatMode.TRACK
                        );
                        updateMessages();
                        break;
                    // Skip current track
                    case nextSong:
                        queue.skip();
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

    if (playingMessage && !playingMessage.deleted)
        playingMessage.edit({ embeds: [pe] });
    else sendPlaying(pe);
}

/**
 * Sends the queueMessage to the music channel and adds reactions.
 *
 * @param embed The queue embed
 */
async function sendQueue(embed: MessageEmbed) {
    queueMessage = await channel.send({ embeds: [embed] });

    [loop, shuffle, previousPage, nextPage].forEach((e) =>
        queueMessage.react(e).catch(console.error)
    );
    queueMessage
        .createReactionCollector({
            filter: (reaction, user) => user != queueMessage.author,
        })
        .on("collect", (reaction, user) => {
            const queue = player.getQueue(channel.guild);
            try {
                switch (reaction.emoji.name) {
                    case shuffle:
                        queue.shuffle();
                        updateQueue(queue);
                        break;
                    case loop:
                        queue.setRepeatMode(
                            queue.repeatMode == QueueRepeatMode.QUEUE
                                ? QueueRepeatMode.OFF
                                : QueueRepeatMode.QUEUE
                        );
                        updateMessages();
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
    // queuePage = page;
    const qe = queueEmbed(queue, page);

    if (queueMessage && !queueMessage.deleted)
        queueMessage.edit({ embeds: [qe] });
    else sendQueue(qe);
}

/**
 * Edits messages with new information, sends them if they don't exist.
 */
function updateMessages() {
    //@ts-ignore
    const queue = player.getQueue(channel.guild);

    updatePlaying(queue);
    updateQueue(queue);
}

/**
 * Sends the helpMessage if it doesn't exist, then deletes it after a minute.
 */
async function sendHelp() {
    if (!helpMessage || helpMessage.deleted) {
        helpMessage = await channel.send({ embeds: [helpEmbed] });

        setTimeout(() => helpMessage.delete(), 60000);
    }
}

/**
 * Checks if a channel is the music channel.
 *
 * @param c The channel
 * @returns true if the channel is the music channel
 */
export function isMusicChannel(c: TextBasedChannels) {
    return c == channel;
}

/**
 * Parses track indices and removes them from the queue.
 *
 * @param content The indices
 */
function removeFromQueue(content: string) {
    // Use a set so there are no duplicates
    const indices: Set<number> = new Set();
    const queue = player.getQueue(channel.guild);

    // Separate the indices
    content
        .trim()
        .split(/[\s,.;:]+/)
        .forEach((s) => {
            const n = parseInt(s);
            if (n > 0 && n <= queue?.tracks.length) indices.add(n - 1);
        });

    // Remove tracks in descending order of indices
    Array.from(indices)
        .sort((a, b) => b - a)
        .forEach((n) => queue.remove(n));

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

    const queue = player.createQueue(message.guild!);

    // Separate prefix and the rest of the message
    const start = message.content[0];
    const rest = message.content.substring(1);

    switch (start) {
        // Remove tracks
        case "-":
            removeFromQueue(rest);
            break;
        // Search (or help)
        case "?":
            if (rest) {
                const results = await player.search(message.content, {
                    requestedBy: message.author,
                });
                onSearchResults(message, results.tracks, queue);
            } else sendHelp();
            break;
        // Play
        default:
            const result = await player.search(message.content, {
                requestedBy: message.author,
            });

            try {
                if (!queue.connection)
                    await queue.connect(message.member?.voice.channel!);

                if (result.playlist) {
                    queue.addTracks(result.tracks);

                    if (!queue.playing) queue.play();
                } else {
                    queue.play(result.tracks[0], {});
                }
            } catch (e) {
                console.error(e);
            }
            break;
    }
}

/**
 * Handles a trackStart event.
 *
 * @param queue The queue
 * @param track The track
 */
export function onTrackStart(queue: Queue, track: Track) {
    console.log(`Track ${track.title} started`);
    updateMessages();
}

/**
 * Handles a trackAdd event.
 *
 * @param queue The queue
 * @param track The track
 */
export function onTrackAdd(queue: Queue, track: Track) {
    console.log(
        `Track ${track.title} added (queue size: ${queue.tracks.length})`
    );
    updateQueue(queue);
}

/**
 * Handles a tracksAdd event.
 *
 * @param queue The queue
 * @param tracks The tracks
 */
export function onTracksAdd(queue: Queue, tracks: Track[]) {
    console.log(
        `Playlist with ${tracks.length} tracks added (queue size: ${queue.tracks.length})`
    );
    updateQueue(queue);
}

/**
 * Handles a queueEnd event.
 *
 * @param queue The queue
 */
export function onQueueEnd(queue: Queue) {
    console.log("Queue ended");
    updateMessages();
}

/**
 * Handles a searchResults event.
 *
 * @param message The message
 * @param tracks The tracks
 * @param queue The queue
 */
export async function onSearchResults(
    message: Message,
    tracks: Track[],
    queue: Queue
) {
    console.log("Search results received");

    // Send message with search results
    const m = await channel.send({ embeds: [searchEmbed(tracks)] });

    try {
        // Add reactions
        [...numberEmoji, dislike].forEach((e) => m.react(e).catch(() => null));

        // Handle reactions
        const r = await m.awaitReactions({
            filter: (reaction, user) =>
                user == message.author &&
                compareReactionEmoji(reaction, [...numberEmoji, dislike]),
            max: 1,
            time: 60000,
            errors: ["time"],
        });
        const reaction = r.first();

        if (!compareReactionEmoji(reaction!, dislike)) {
            // Emulate sending track choice through default method
            try {
                if (!queue.connection)
                    await queue.connect(message.member?.voice.channel!);
                queue.play(tracks[numberEmoji.indexOf(reaction!.emoji.name!)]);
            } catch {}
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
 * @param queue The queue
 */
export async function onBotDisconnect(queue: Queue) {
    console.warn("Bot disconnected");
    updateMessages();
}

/**
 * Handles a channelEmpty event.
 *
 * @param queue The queue
 */
export async function onChannelEmpty(queue: Queue) {
    console.warn("Channel empty");
    updateMessages();
}
