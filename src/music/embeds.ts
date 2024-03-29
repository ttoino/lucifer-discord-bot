import { Queue, Track } from "discord-player";
import { MessageEmbed } from "discord.js";
import { botColor, numberEmoji, songsPerPage } from "../constants";
import { formatTime, PagedQueue, queuePages } from "../util";

/**
 * Creates a base embed every other embed extends. Right now it just changes the color to red.
 *
 * @returns The base embed for the bot
 */
export function baseEmbed() {
    return new MessageEmbed().setColor(botColor);
}

/**
 * Creates an embed to represent a YouTube search. Will only show at most 10 tracks.
 *
 * @param tracks The list of tracks to show in the embed
 * @returns The search embed
 */
export function searchEmbed(tracks: Track[]) {
    const desc = tracks
        .slice(0, 10)
        .map((t, i) => `${numberEmoji[i]} **${t.title}** — ${t.author}`)
        .join("\n");

    return baseEmbed().setTitle("Pesquisa").setDescription(desc);
}

/**
 * Creates an embed that shows the current playing track's info.
 *
 * @param queue The queue
 * @returns The playing embed
 */
function playingEmbed(queue: Queue): MessageEmbed {
    const track = queue.current;

    return baseEmbed()
        .setTitle(`${track.title} — ${track.duration}`)
        .setURL(track.url)
        .setDescription(`${track.author} — *${track.requestedBy.username}*`)
        .setImage(track.thumbnail);
}

/**
 * The default embed shown when no track is playing.
 */
const notPlayingEmbed = baseEmbed().setTitle("Sem música a tocar");

/**
 * Creates an embed that shows the current track if one is being played.
 *
 * @param queue The queue
 * @returns The play embed
 */
export function playEmbed(queue: Queue | undefined): MessageEmbed {
    return queue?.playing ? playingEmbed(queue) : notPlayingEmbed;
}

/**
 * Creates an embed that shows a page of the queue.
 *
 * @param queue The queue
 * @returns The queue embed
 */
export function queueEmbed(queue: PagedQueue): MessageEmbed {
    let tracks = queue.tracks;
    const duration = tracks.reduce((d, t) => d + t.durationMS, 0) / 1000;
    const length = tracks.length;
    const page = queue.metadata ?? 0;
    tracks = tracks.slice(page * songsPerPage, (page + 1) * songsPerPage);
    const pages = queuePages(queue);

    return baseEmbed()
        .setTitle(
            `Fila — ${length} música${length > 1 ? "s" : ""} — ${formatTime(
                duration
            )}`
        )
        .addFields(
            tracks.map((t, i) => ({
                name: `${page * 10 + i + 1}. ${t.title} — ${t.duration}`,
                value: `${t.author} — *${t.requestedBy.username}*`,
            }))
        )
        .setFooter(`Página ${page + 1}/${pages}`);
}

/**
 * The embed shown when the user asks for help in the music channel.
 */
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
