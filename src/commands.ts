import Command from "./Command";
import bind from "./commands/bind";
import castigo from "./commands/castigo";
import help from "./commands/help";
import moveall from "./commands/moveall";
import nick from "./commands/nick";
import play from "./commands/play";

const commands: { [key: string]: Command } = {
    help,
    nick,
    castigo,
    bind,
    play,
    moveall,
};

export default commands;
