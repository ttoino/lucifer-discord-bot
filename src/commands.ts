import fs from "fs";
import Command from "./Command";

const commands = fs
    .readdirSync("./src/commands/")
    .filter((file) => file.endsWith(".ts"))
    .map((file) => require(`./commands/${file}`).default) as Command[];

export default commands;

export const commandMap = new Map(
    commands.map((command) => [command.builder.name, command])
);

export const json = commands.map((command) => command.builder.toJSON!());
