import Command from "./Command";

import help from "./commands/help";
import nick from "./commands/nick";
import bind from "./commands/bind";
import play from "./commands/play";
import castigo from "./commands/castigo";
import moveall from "./commands/moveall";

const commands: {[key: string]: Command} = {
    help,
    nick,
    castigo,
    bind,
    play,
    moveall
};

export default commands;