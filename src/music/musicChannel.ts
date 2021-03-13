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
import { compareReactionEmoji, queuePages } from "../util";
import { playEmbed, queueEmbed, searchEmbed } from "./embeds";
import { player } from "./player";

let channel: TextChannel;
let playingMessage: Message;
let queueMessage: Message;
let queuePage = 0;

export async function startMusicChannel(client: Client) {
    channel = client.channels.cache.get(
        process.env.BOT_CHANNEL!
    ) as TextChannel;

    const messages = await channel.messages.fetch({ limit: 100 });
    channel.bulkDelete(messages);

    updateMessages();
}

async function sendPlaying(embed: MessageEmbed) {
    playingMessage = await channel.send(embed);

    [playPause, stop, loop, nextSong].forEach((e) =>
        playingMessage.react(e).catch(console.error)
    );
    playingMessage
        .createReactionCollector(
            (reaction, user) => user != playingMessage.author
        )
        .on("collect", (reaction, user) => {
            try {
                switch (reaction.emoji.name) {
                    case playPause:
                        player.getQueue(playingMessage).paused
                            ? player.resume(playingMessage)
                            : player.pause(playingMessage);
                        updatePlaying(player.getQueue(playingMessage));
                        break;
                    case stop:
                        player.stop(playingMessage);
                        updateMessages();
                        break;
                    case loop:
                        const queue = player.getQueue(playingMessage);
                        player.setRepeatMode(playingMessage, !queue.repeatMode);
                        updatePlaying(queue);
                        break;
                    case nextSong:
                        player.skip(playingMessage);
                        break;
                }
            } catch (e) {
                console.error(e);
            } finally {
                reaction.users.remove(user);
            }
        });
}

function updatePlaying(queue: Queue | undefined) {
    const pe = playEmbed(queue);

    if (playingMessage && !playingMessage.deleted) playingMessage.edit(pe);
    else sendPlaying(pe);
}

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

async function updateQueue(queue: Queue | undefined, page = 0) {
    queuePage = page;
    const qe = queueEmbed(queue, page);

    if (queueMessage && !queueMessage.deleted) queueMessage.edit(qe);
    else sendQueue(qe);
}

function updateMessages() {
    //@ts-ignore
    const queue = player.getQueue({ guild: { id: channel.guild.id } });

    updatePlaying(queue);
    updateQueue(queue);
}

export function isMusicChannel(c: Channel) {
    return c == channel;
}

// EVENTS
export async function onMusicChannelMessage(message: Message) {
    message.delete();

    const start = message.content[0];

    switch (start) {
        case "?":
            await player.play(message, message.content.substring(1), false);
            break;
        default:
            await player.play(message, message.content, true);
            break;
    }
}

export function onTrackStart(message: Message, track: Track) {
    console.log(`Track ${track.title} started`);
    updateMessages();
}

export function onTrackAdd(message: Message, queue: Queue, track: Track) {
    console.log(
        `Track ${track.title} added (queue size: ${queue.tracks.length})`
    );
    updateQueue(queue);
}

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

export async function onQueueCreate(message: Message, queue: Queue) {
    await new Promise((resolve) => setTimeout(resolve, 50));
    console.log(`Queue with ${queue.tracks.length} tracks created`);
    updateQueue(queue);
}

export function onQueueEnd(message: Message, queue: Queue) {
    console.log("Queue ended");
    updateMessages();
}

export async function onSearchResults(
    message: Message,
    query: string,
    tracks: Track[],
    collector: MessageCollector
) {
    console.log("Search results received");
    collector.stop();
    const m = await channel.send(searchEmbed(tracks));

    try {
        [...numberEmoji, dislike].forEach((e) => m.react(e).catch(() => null));

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
            collector.emit("collect", {
                content: numberEmoji.indexOf(reaction.emoji.name) + 1,
            });
        }
    } catch (e) {
        console.error(e);
    } finally {
        m.delete();
    }
}
