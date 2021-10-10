// Load environment variables before anything else happens
import { Channel, Client, Intents, Role } from "discord.js";
import dotenv from "dotenv";
import buttons from "./buttons";
import { OptionsArg } from "./Command";
import commands from "./commands";
import { initMusicChannel, initPlayer } from "./music";
import { onMessageCreate } from "./music/events";
import selectmenus from "./selectmenus";
dotenv.config();

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

client.once("ready", async () => {
    console.log("Ready!");

    for (const [_, guild] of await client.guilds.fetch())
        initMusicChannel(await guild.fetch());
});

client.on("messageCreate", (message) => {
    // const m = message.content;

    // Ignore messages by bots
    if (message.author.bot) return;

    // Handle music channel messages
    onMessageCreate(message);
});

// TODO: Admin commands, maybe argument parsing?
client.on("interactionCreate", (interaction) => {
    if (interaction.isCommand()) {
        const command = commands[interaction.commandName];

        if (!command) return;

        let opt, sub;

        if (command.subcommands) {
            sub = interaction.options.getSubcommand(true);
            opt = command.subcommands[sub].options;
        }

        opt ??= command.options;

        if (opt) {
            const options: OptionsArg<any> = {};

            for (const option in opt) {
                const { optional } = opt[option];

                const o = interaction.options.get(option, !optional);

                const value =
                    (o?.channel as Channel | undefined) ??
                    o?.user ??
                    (o?.role as Role | undefined) ??
                    o?.value;

                options[option] = value;
            }

            if (sub) return command.call(interaction, sub, options);

            return command.call(interaction, options);
        }

        return command.call(interaction);
    } else if (interaction.isButton()) {
        if (interaction.customId in buttons)
            buttons[interaction.customId](interaction);
    } else if (interaction.isSelectMenu()) {
        if (interaction.customId in selectmenus)
            selectmenus[interaction.customId](interaction);
    } else if (interaction.isContextMenu()) {
        interaction;
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
