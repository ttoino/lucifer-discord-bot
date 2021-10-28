import { ApplicationCommandOptionType } from "discord-api-types/v9";
import { Channel, CommandInteraction, Role, User } from "discord.js";

/**
 *
 */
export interface Command<A extends any[] = []> {
    description: string;

    // json: ReturnType<SlashCommandBuilder["toJSON"]>;

    /**
     * Called when the command is called
     *
     * @param interaction The interaction associated with the command
     */
    call: (interaction: CommandInteraction, ...args: A) => void;

    /**
     * If true the command can only be called by server administrators
     *
     * @default false
     */
    admin?: typeof admin;
}

export interface CommandWithOptions<O extends Options>
    extends Command<[OptionsArg<O>]> {
    options: O;
}

export interface CommandWithSubCommands<S extends Subcommands>
    extends Command<SubcommandsArgs<S, keyof S>> {
    subcommands: S;
}

// TODO: Subcommands without options, subcommand groups
export interface SubCommand<O extends Options> {
    description: string;
    options: O;
}

export type Subcommands = {
    [name: string]: SubCommand<Options>;
};

export type SubcommandsArgs<S extends Subcommands, K extends keyof S> = [
    K,
    OptionsArg<S[K]["options"]>
];

export interface Option {
    description: string;
    optional?: typeof optional;
    type: OptionType;
}

export type Options = {
    [name: string]: Option;
};

type OptionValueType<O extends OptionType> = O extends "boolean"
    ? boolean
    : O extends "User"
    ? User
    : O extends "Channel"
    ? Channel
    : O extends "Role"
    ? Role
    : O extends "string"
    ? string
    : O extends "float"
    ? number
    : O extends "int"
    ? number
    : undefined;

export type OptionsArg<O extends Options> = {
    [name in keyof O]: O[name] extends { optional: true }
        ? OptionValueType<O[name]["type"]> | undefined
        : OptionValueType<O[name]["type"]>;
};

// TODO: Channel types, integer
export type OptionType =
    | "boolean"
    | "User"
    | "Channel"
    | "Role"
    | "string"
    | "float"
    | "int";

export const optionTypeMap: Record<OptionType, ApplicationCommandOptionType> = {
    boolean: ApplicationCommandOptionType.Boolean,
    User: ApplicationCommandOptionType.User,
    Channel: ApplicationCommandOptionType.Channel,
    Role: ApplicationCommandOptionType.Role,
    string: ApplicationCommandOptionType.String,
    float: ApplicationCommandOptionType.Number,
    int: ApplicationCommandOptionType.Integer,
};

export const admin = true;
export const optional = true;
export const integer = true;
