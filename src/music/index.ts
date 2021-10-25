import { Collection } from "@discordjs/collection";
import { Snowflake } from "discord-api-types/v9";
import { Player, QueueRepeatMode, Track } from "discord-player";
import {
    Client,
    Guild,
    GuildMember,
    GuildResolvable,
    Message,
    MessageActionRow,
    MessageEmbed,
    TextChannel,
} from "discord.js";
import { ytdlOptions } from "../constants";
// import { client } from "..";
import { PagedQueue, queuePages, SearchResults } from "../util";
import {
    playRow,
    queueRow,
    repeatModeMenuRow,
    searchMenuRow,
} from "./components";
import { playEmbed, queueEmbed, searchEmbed } from "./embeds";
import {
    onBotDisconnect,
    onChannelEmpty,
    onConnectionCreate,
    onConnectionError,
    onDebug,
    onError,
    onQueueEnd,
    onTrackAdd,
    onTrackEnd,
    onTracksAdd,
    onTrackStart,
} from "./events";

// MESSAGES

export const messages: Collection<Snowflake, Message> = new Collection();

export const searches: Collection<Snowflake, SearchResults> = new Collection();

export const musicChannel = (guild: Guild) =>
    guild.channels.cache.find(
        (c) => c.name.includes("music") && c.isText()
    ) as TextChannel;

export async function initMusicChannel(guild: Guild) {
    // const guild = client.guilds.resolve(guildR);

    if (!guild) return console.error("Unknown guild!");

    const channel = musicChannel(guild);

    // Delete old messages
    const messages = await channel.messages.fetch({ limit: 100 });
    channel.bulkDelete(messages);

    // Set channel topic
    channel.setTopic(
        "Escreve o nome ou link de uma música para a tocar!\nEscreve um **?** para ver mais opções!"
    );

    updateMessage(channel.guild);
}

export async function updateMessage(guild: Guild) {
    if (!guild) return console.error("Unknown guild!");

    const message = messages.get(guild.id);
    const messagePayload = getMessagePayload(guild);

    if (!message) {
        messages.set(guild.id, await musicChannel(guild).send(messagePayload));
    } else {
        message.edit(messagePayload);
    }
}

export function getMessagePayload(guild: Guild) {
    const embeds: MessageEmbed[] = [];
    const components: MessageActionRow[] = [];

    const queue: PagedQueue = getQueue(guild);

    if (queue.metadata && queue.metadata >= queuePages(queue))
        queue.metadata = queuePages(queue) - 1;

    embeds.push(playEmbed(queue));

    if (queue.playing) {
        components.push(
            playRow(
                queue.connection.paused,
                queue.tracks.length < 2,
                queue.tracks.length == 0
            )
        );

        if (queue.tracks.length) embeds.push(queueEmbed(queue));

        if (queuePages(queue) > 1)
            components.push(
                queueRow(
                    (queue.metadata ?? 0) == 0,
                    (queue.metadata ?? 0) == queuePages(queue) - 1
                )
            );

        components.push(repeatModeMenuRow(queue.repeatMode));
    }

    return { embeds, components };
}

// PLAYER

export let player: Player;

export function initPlayer(client: Client) {
    player = new Player(client)
        // When disconnected by someone
        .on("botDisconnect", onBotDisconnect)
        // Triggers when the bot is left alone in a voice channel
        // Seems inconsistent
        .on("channelEmpty", onChannelEmpty)
        // TODO: Document this
        .on("connectionCreate", onConnectionCreate)
        // TODO: Document this
        .on("connectionError", onConnectionError)
        // TODO: Document this
        .on("debug", onDebug)
        // General errors, ignoring for now
        .on("error", onError)
        // When queued music stops
        .on("queueEnd", onQueueEnd)
        // When a single track is added
        .on("trackAdd", onTrackAdd)
        // TODO: Document this
        .on("tracksAdd", onTracksAdd)
        // Every time a track starts
        .on("trackStart", onTrackStart)
        // TODO: Document this
        .on("trackEnd", onTrackEnd);
}

export const getQueue: Player["createQueue"] = (guild, options?) =>
    player.createQueue(guild, { ytdlOptions, ...options });

// GENERAL METHODS

export async function play(
    member: GuildMember,
    results: Track | SearchResults
) {
    const queue = getQueue(member.guild);

    if (!queue.connection) await queue.connect(member.voice.channel!);

    if (!(results instanceof Track)) {
        if (results.playlist) {
            queue.addTracks(results.tracks);

            if (!queue.playing) queue.play();

            return;
        }

        results = results.tracks[0];
    }

    queue.play(results);
}

export function search(message: Snowflake, results: SearchResults) {
    // searches.set(message, results);

    return {
        embeds: [searchEmbed(results.tracks)],
        components: [searchMenuRow(results)],
    };
}

export async function select(
    member: GuildMember,
    message: Snowflake,
    index: number
) {
    const track = searches.get(message)?.tracks[index];

    if (!track) return;

    await play(member, track);
}

export function pause(guild: Guild) {
    const queue = getQueue(guild);

    queue.setPaused(true);
    updateMessage(guild);
}

export function resume(guild: Guild) {
    const queue = getQueue(guild);

    queue.setPaused(false);
    updateMessage(guild);
}

export function stop(guild: Guild) {
    const queue = getQueue(guild);

    queue.stop();
    updateMessage(guild);
}

export function previousSong(guild: GuildResolvable) {
    const queue = getQueue(guild);

    return queue.back();
}

export function nextSong(guild: GuildResolvable) {
    const queue = getQueue(guild);

    return queue.skip();
}

export function firstPage(guild: Guild) {
    const queue: PagedQueue = getQueue(guild);

    queue.metadata = 0;
    updateMessage(guild);
}

export function lastPage(guild: Guild) {
    const queue: PagedQueue = getQueue(guild);

    queue.metadata = queuePages(queue) - 1;
    updateMessage(guild);
}

export function previousPage(guild: Guild) {
    const queue: PagedQueue = getQueue(guild);

    queue.metadata = Math.max((queue.metadata ?? 0) - 1, 0);
    updateMessage(guild);
}

export function nextPage(guild: Guild) {
    const queue: PagedQueue = getQueue(guild);

    queue.metadata = Math.min((queue.metadata ?? 0) + 1, queuePages(queue) - 1);
    updateMessage(guild);
}

export function shuffle(guild: Guild) {
    const queue = getQueue(guild);

    queue.shuffle();
    updateMessage(guild);
}

export function setRepeatMode(guild: Guild, repeatMode: QueueRepeatMode) {
    const queue = getQueue(guild);

    queue.setRepeatMode(repeatMode);
}
