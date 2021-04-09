import { Queue, Track } from "discord-player";
import { MessageEmbed } from "discord.js";
import {
    botColor,
    loop,
    numberEmoji,
    pause,
    play,
    songsPerPage,
} from "../constants";
import { queuePages } from "../util";

export function baseEmbed() {
    return new MessageEmbed().setColor(botColor);
}

export function searchEmbed(tracks: Track[]) {
    const desc = tracks
        .slice(0, 10)
        .map((t, i) => `${numberEmoji[i]} **${t.title}** — ${t.author}`)
        .join("\n");

    return baseEmbed().setTitle("Pesquisa").setDescription(desc);
}

function playingEmbed(queue: Queue): MessageEmbed {
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

const notPlayingEmbed = baseEmbed().setTitle("Sem música a tocar");

export function playEmbed(queue: Queue | undefined): MessageEmbed {
    return queue ? playingEmbed(queue) : notPlayingEmbed;
}

const emptyQueueEmbed = baseEmbed().setTitle("Fila vazia");

function notEmptyQueueEmbed(queue: Queue, page: number): MessageEmbed {
    let tracks = queue.tracks.slice(1);
    const length = tracks.length;
    tracks = tracks.slice(page * songsPerPage, (page + 1) * songsPerPage);
    const pages = queuePages(queue);

    return baseEmbed()
        .setTitle(
            `${queue.loopMode ? loop + " " : ""}Fila — ${length} música${
                length > 1 ? "s" : ""
            }`
        )
        .addFields(
            tracks.map((t) => ({
                name: `${queue.tracks.indexOf(t)}. ${t.title}`,
                value: `${t.author} — *${t.requestedBy.username}*`,
            }))
        )
        .setFooter(`Página ${page + 1}/${pages}`);
}

export function queueEmbed(
    queue: Queue | undefined,
    page: number
): MessageEmbed {
    return queue && queue.tracks.length > 1
        ? notEmptyQueueEmbed(queue, page)
        : emptyQueueEmbed;
}

export const helpEmbed = baseEmbed()
    .setTitle("Ajuda")
    .setDescription(
        "Escrever o nome de uma música pesquisa no YouTube e toca o primeiro resultado\n" +
            "Também suporta links do YouTube, Spotify e Soundcloud\n\n" +
            "Começar a mensagem com alguns símbolos tem efeitos especiais:\n\n" +
            "**?** — Pesquisa no YouTube e mostra os primeiros 10 resultados\n" +
            "*?post malone* — Pesquisa `post malone` no YouTube\n\n" +
            "**-** — Retira as músicas com os índices especificados da fila\n" +
            "*-1 2,6;8* — Retira as músicas com os índices 1, 2, 6 e 8"
    )
    .setFooter("Esta mensagem vai autodestruir-se dentro de 60 segundos");
