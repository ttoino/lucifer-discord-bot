import Discord from "discord.js";
import commands from "./commands";

const client = new Discord.Client();

client.once("ready", () => {
    console.log("Ready!");
});

client.on("message", (message) => {
    const m = message.content;
    const u = message.author;
    
    if (!m.startsWith("!") || u.bot) return;
    
    const args = m.slice(1).split(" ");

    console.log(args);

    const command = args.shift()?.toLowerCase();

    if (command)
        commands[command]?.call(message, ...args);
});

const nameRegex = /^\▶.*\◀$/;
client.on("guildMemberUpdate", (u, nu) => {
    const name = nu.nickname ? nu.nickname : nu.user?.username!;

    if (nu.roles.cache.some((r) => r.name.endsWith("GODS BLOOD"))) {
        if (!nameRegex.test(name)) {
            console.log(`Setting ${name}'s nick`);

            nu.setNickname(`▶${name}◀`);
        }
    } else if (nameRegex.test(name)) {
        const nn = name.replace(/[▶◀]/g, "");
        nu.setNickname(nn);
    }
});

client.on("guildMemberAdd", u => {
    if (u.roles.cache.size == 0) {
        if (!u.user?.bot) {
            const role = u.guild.roles.cache.find(r => r.name.endsWith("MENINOS DO SENHOR"));

            if (role)
                u.roles.add(role);
        }
    }
});

client.login("NzEyNzgyOTE3NDAyNjI0MDgw.XsWsKg.DLVGtFmZroNdIjjvFRcrQi3WCYQ");