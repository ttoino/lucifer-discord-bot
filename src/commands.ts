import Command from "./Command";

import help from "./commands/help";
import nick from "./commands/nick";
import bind from "./commands/bind";
import play from "./commands/play";

const commands: {[key: string]: Command} = {
    help,
    nick,
    bind,
    play
};

export default commands;