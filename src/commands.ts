import Command from "./Command";
import castigo from "./commands/castigo";
import help from "./commands/help";
import moveall from "./commands/moveall";
import nick from "./commands/nick";

const commands: { [key: string]: Command } = {
    help,
    nick,
    castigo,
    moveall,
};

export default commands;
