import dotenv from "dotenv";
dotenv.config();

import Discord from "discord.js";
import commands from "./commands";
import { initPlayer } from "./music/player";
import {
    isMusicChannel,
    onMusicChannelMessage,
    startMusicChannel,
} from "./music/musicChannel";
import { botPrefix } from "./constants";

export const client = new Discord.Client();
initPlayer(client);

client.once("ready", () => {
    console.log("Ready!");

    startMusicChannel(client);
});

client.on("message", (message) => {
    const m = message.content;

    if (message.author.bot) return;
    if (isMusicChannel(message.channel)) return onMusicChannelMessage(message);
    if (!m.startsWith(botPrefix)) return;

    const args = m.slice(botPrefix.length).split(/\s+/);

    console.log(args);

    const command = args.shift()?.toLowerCase();

    if (command) commands[command]?.call(message, ...args);
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
