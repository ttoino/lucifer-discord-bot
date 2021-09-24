import { Player } from "discord-player";
import { Client } from "discord.js";
import {
    onTrackStart,
    onTrackAdd,
    onQueueEnd,
    onBotDisconnect,
    onChannelEmpty,
    onTracksAdd,
} from "./musicChannel";

export let player: Player;

export function initPlayer(client: Client) {
    player = new Player(client)
        // When disconnected by someone
        .on("botDisconnect", onBotDisconnect)
        // Triggers when the bot is left alone in a voice channel
        // Seems inconsistent
        .on("channelEmpty", onChannelEmpty)
        // TODO
        .on("connectionCreate", console.log)
        // TODO
        .on("connectionError", (queue, error) => {
            console.error(error);
        })
        // TODO
        .on("debug", (queue, message) => {
            console.debug(message);
        })
        // General errors, ignoring for now
        .on("error", (queue, error) => {
            console.error(error);
        })
        // When queued music stops
        .on("queueEnd", onQueueEnd)
        // When a single track is added
        .on("trackAdd", onTrackAdd)
        // TODO
        .on("trackEnd", console.log)
        // TODO
        .on("tracksAdd", onTracksAdd)
        // Every time a track starts
        .on("trackStart", onTrackStart);
}
