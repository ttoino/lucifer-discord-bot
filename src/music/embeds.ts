import { Queue, Track } from "discord-player";
import { MessageEmbed } from "discord.js";
import { loop, numberEmoji, pause, play } from "../constants";

export function baseEmbed() {
    return new MessageEmbed().setColor("#F03A17");
}

export function searchEmbed(tracks: Track[]) {
    const desc = tracks
        .slice(0, 10)
        .map((t, i) => `${numberEmoji[i]} **${t.title}** — ${t.author}`)
        .join("\n");

    return baseEmbed().setTitle("Pesquisa").setDescription(desc);
}

export function playingEmbed(queue: Queue): MessageEmbed {
    const track = queue.playing;

    return baseEmbed()
        .setTitle(
            `${queue.paused ? pause : play}${
                queue.repeatMode ? " " + loop : ""
            } ${track.title}`
        )
        .setURL(track.url)
        .setDescription(`${track.author} — *${track.requestedBy.username}*`)
        .setImage(track.thumbnail);
}

export function notPlayingEmbed(): MessageEmbed {
    return baseEmbed().setTitle("Sem música a tocar");
}

export function playEmbed(queue: Queue | undefined): MessageEmbed {
    return queue ? playingEmbed(queue) : notPlayingEmbed();
}

export function emptyQueueEmbed(): MessageEmbed {
    return baseEmbed().setTitle("Fila vazia");
}

export function notEmptyQueueEmbed(queue: Queue): MessageEmbed {
    const tracks = queue.tracks.slice(1);

    return baseEmbed()
        .setTitle(
            `${queue.loopMode ? loop + " " : ""}Fila — ${tracks.length} música${
                tracks.length > 1 ? "s" : ""
            }`
        )
        .addFields(
            tracks.map((t) => ({
                name: t.title,
                value: `${t.author} — *${t.requestedBy.username}*`,
            }))
        );
}

export function queueEmbed(queue: Queue | undefined): MessageEmbed {
    return queue && queue.tracks.length > 1
        ? notEmptyQueueEmbed(queue)
        : emptyQueueEmbed();
}
