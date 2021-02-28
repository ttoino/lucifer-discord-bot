import { Player } from "discord-player";
import { Client } from "discord.js";
import {
    onTrackStart,
    onTrackAdd,
    onSearchResults,
    onPlaylistAdd,
    onQueueCreate,
    onQueueEnd,
} from "./musicChannel";

export let player: Player;

export function initPlayer(client: Client) {
    player = new Player(client);

    player
        .on("trackStart", onTrackStart)
        .on("trackAdd", onTrackAdd)
        .on("playlistAdd", onPlaylistAdd)
        .on("playlistParseStart", (x, m) => {
            console.log("Playlist parse started");
        })
        .on("playlistParseEnd", (x, m) => {
            console.log("Playlist parse ended");
        })
        .on("queueCreate", onQueueCreate)
        .on("queueEnd", onQueueEnd)
        .on("botDisconnect", (m) => {
            console.warn("Bot disconnected");
        })
        .on("channelEmpty", (m) => {
            console.warn("Channel empty");
        })
        // @ts-ignore
        .on("searchResults", onSearchResults)
        .on("searchCancel", (m, s, t) => {
            console.warn("Search cancelled");
        })
        .on("searchInvalidResponse", (m, s, t, ss, mc) => {
            console.error("Search invalid response");
        })
        .on("error", (e, m) => {
            console.error(e);
        })
        .on("noResults", (m, s) => {
            console.error("No results");
        })
        .on("musicStop", () => {
            console.log("Music stopped");
        });
}
