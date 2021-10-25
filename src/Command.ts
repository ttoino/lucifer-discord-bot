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

export type SubCommand<O extends Options> = Omit<
    CommandWithOptions<O>,
    "call" | "admin"
>;

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

type OptionValueType<O extends OptionType> = O extends typeof Boolean
    ? boolean
    : O extends typeof User
    ? User
    : O extends typeof Channel
    ? Channel
    : O extends typeof Role
    ? Role
    : O extends typeof String
    ? string
    : O extends typeof Number
    ? number
    : undefined;

export type OptionsArg<O extends Options> = {
    [name in keyof O]: O[name] extends { optional: true }
        ? OptionValueType<O[name]["type"]> | undefined
        : OptionValueType<O[name]["type"]>;
};

// TODO: Channel types, integer
export type OptionType =
    | typeof Boolean
    | typeof User
    | typeof Channel
    | typeof Role
    | typeof String
    | typeof Number;

export const toApplicationCommandOptionType = (
    type: OptionType
): ApplicationCommandOptionType => {
    switch (type) {
        case Boolean:
            return ApplicationCommandOptionType.Boolean;
        case User:
            return ApplicationCommandOptionType.User;
        case Channel:
            return ApplicationCommandOptionType.Channel;
        case Role:
            return ApplicationCommandOptionType.Role;
        case String:
            return ApplicationCommandOptionType.String;
        case Number:
            return ApplicationCommandOptionType.Number;
        default:
            return ApplicationCommandOptionType.Mentionable;
    }
};

export const admin = true;
export const optional = true;
export const integer = true;
