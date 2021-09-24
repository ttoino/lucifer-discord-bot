// Load environment variables before anything else happens
import dotenv from "dotenv";
dotenv.config();

import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { json } from "./commands";

(async () => {
    const rest = new REST({ version: "9" }).setToken(process.env.BOT_TOKEN!);

    try {
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.DEV_CLIENT_ID!,
                process.env.DEV_GUILD_ID!
            ),
            { body: json }
        );
    } catch (error) {
        console.error(error);
    }
})();
