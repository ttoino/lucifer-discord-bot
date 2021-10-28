import {
    APIApplicationCommandOption,
    ApplicationCommandOptionType,
    RESTPostAPIApplicationCommandsJSONBody,
} from "discord-api-types/v9";
import fs from "fs";
import path from "path";
import {
    Command,
    CommandWithOptions,
    CommandWithSubCommands,
    Options,
    optionTypeMap,
    Subcommands,
} from "./Command";

const commands = Object.fromEntries(
    fs
        .readdirSync("./src/commands/")
        .filter((file) => file.endsWith(".ts"))
        .map((file) => [
            path.parse(file).name,
            require(`./commands/${file}`).default as Command &
                Partial<CommandWithOptions<Options>> &
                Partial<CommandWithSubCommands<Subcommands>>,
        ])
);

export default commands;

const parseOptions = (options: Options): APIApplicationCommandOption[] => {
    const r: APIApplicationCommandOption[] = [];

    for (const option in options) {
        const { description, type, optional } = options[option];
        r.push({
            name: option,
            description,
            type: optionTypeMap[type],
            required: !optional,
        });
    }

    return r;
};

export const json = (() => {
    const r: RESTPostAPIApplicationCommandsJSONBody[] = [];

    for (const name in commands) {
        const command = commands[name];

        let opt: APIApplicationCommandOption[] = [];

        if (command.options) opt = parseOptions(command.options);

        if (command.subcommands)
            for (const subcommand in command.subcommands) {
                const { description, options } =
                    command.subcommands[subcommand];
                opt.push({
                    name: subcommand,
                    description,
                    type: ApplicationCommandOptionType.Subcommand,
                    options: options ? parseOptions(options) : [],
                });
            }

        r.push({
            name,
            description: command.description,
            options: opt,
        });
    }

    return r;
})();
