// Load environment variables before anything else happens
import dotenv from "dotenv";
dotenv.config();

import { Client, Intents } from "discord.js";
import commands from "./commands";
import { initPlayer } from "./music/player";
import {
    isMusicChannel,
    onMusicChannelMessage,
    startMusicChannel,
} from "./music/musicChannel";
import { botPrefix } from "./constants";

export const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ],
});
initPlayer(client);

client.once("ready", () => {
    console.log("Ready!");

    startMusicChannel(client);

    client.user?.setPresence({
        status: "online",
        activities: [
            {
                name: botPrefix + "help",
                type: "PLAYING",
            },
        ],
    });
});

client.on("messageCreate", (message) => {
    const m = message.content;

    // Ignore messages by bots
    if (message.author.bot) return;

    // Handle music channel messages
    if (isMusicChannel(message.channel)) return onMusicChannelMessage(message);

    // Ignore messages that are not commands
    if (!m.startsWith(botPrefix)) return;

    // Separate message into command and arguments
    const args = m.slice(botPrefix.length).split(/\s+/);
    const command = args.shift()?.toLowerCase();

    // Call command
    if (command) {
        const c = commands[command];
        if (c) {
            if (c.admin && !message.member?.permissions.has("ADMINISTRATOR")) {
                message.channel.send("Não és digno :imp:");
                return;
            }
            c.call(message, ...args);
        }
    }
});

const nameRegex = /^\▶.*\◀$/;
client.on("guildMemberUpdate", (u, nu) => {
    const name = nu.nickname || nu.user?.username;

    if (nu.roles.cache.some((r) => r.name.endsWith("GODS BLOOD"))) {
        if (!nameRegex.test(name)) {
            nu.setNickname(`▶${name}◀`);
            console.log(`${name} -> ▶${name}◀`);
        }
    } else if (nameRegex.test(name)) {
        const nn = name.replace(/[▶◀]/g, "");
        nu.setNickname(nn);
        console.log(`${name} -> ${nn}`);
    }
});

client.on("guildMemberAdd", (u) => {
    if (u.roles.cache.size == 1) {
        if (!u.user?.bot) {
            const role = u.guild.roles.cache.find((r) =>
                r.name.endsWith("MENINOS DO SENHOR")
            );

            if (role) {
                u.roles.add(role);

                console.log(`${u.displayName} é menino`);
            }
        }
    }
});

client.login(process.env.BOT_TOKEN);
