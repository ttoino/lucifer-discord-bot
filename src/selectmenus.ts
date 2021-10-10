import { SelectMenuInteraction } from "discord.js";
import fs from "fs";
import path from "path";

const selectmenus = Object.fromEntries(
    fs
        .readdirSync("./src/selectmenus/")
        .filter((file) => file.endsWith(".ts"))
        .map((file) => [
            path.parse(file).name,
            require(`./selectmenus/${file}`).default as (
                interaction: SelectMenuInteraction
            ) => any,
        ])
);

export default selectmenus;
