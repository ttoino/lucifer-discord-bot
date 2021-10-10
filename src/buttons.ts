import { ButtonInteraction } from "discord.js";
import fs from "fs";
import path from "path";

const buttons = Object.fromEntries(
    fs
        .readdirSync("./src/buttons/")
        .filter((file) => file.endsWith(".ts"))
        .map((file) => [
            path.parse(file).name,
            require(`./buttons/${file}`).default as (
                interaction: ButtonInteraction
            ) => any,
        ])
);

export default buttons;
