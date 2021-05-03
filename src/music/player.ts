import { Player } from "discord-player";
import { Client } from "discord.js";
import {
    onTrackStart,
    onTrackAdd,
    onSearchResults,
    onPlaylistAdd,
    onQueueCreate,
    onQueueEnd,
    onBotDisconnect,
    onChannelEmpty,
} from "./musicChannel";

export let player: Player;

export function initPlayer(client: Client) {
    player = new Player(client)
        // Every time a track starts
        .on("trackStart", onTrackStart)
        // When a single track is added
        .on("trackAdd", onTrackAdd)
        // When a playlist is added
        .on("playlistAdd", onPlaylistAdd)
        // These don't matter
        .on("playlistParseStart", (x, m) => {
            console.log("Playlist parse started");
        })
        .on("playlistParseEnd", (x, m) => {
            console.log("Playlist parse ended");
        })
        // When the first track is added
        .on("queueCreate", onQueueCreate)
        // When queued music stops
        .on("queueEnd", onQueueEnd)
        // When disconnected by someone
        .on("botDisconnect", onBotDisconnect)
        // Triggers when the bot is left alone in a voice channel
        // Seems inconsistent
        .on("channelEmpty", onChannelEmpty)
        // When search results come back
        // ⬇ Need this because the types don't match the api
        // @ts-ignore
        .on("searchResults", onSearchResults)
        // When someone takes too long to reply to a search
        // Should never trigger because we override the default search system
        .on("searchCancel", (m, s, t) => {
            console.warn("Search cancelled");
        })
        // Same here
        .on("searchInvalidResponse", (m, s, t, ss, mc) => {
            console.error("Search invalid response");
        })
        // General errors, ignoring for now
        .on("error", (e, m) => {
            console.error(e);
        })
        // No search results, also ignored for now
        .on("noResults", (m, s) => {
            console.error("No results");
        })
        // Doesn't seem to trigger 🤷‍♂️
        .on("musicStop", () => {
            console.log("Music stopped");
        });
}
