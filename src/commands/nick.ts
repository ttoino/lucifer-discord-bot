import Command from "../Command";
import { like } from "../constants";

const nick: Command = {
    name: "nick",
    description: "Muda o teu nickname",
    call: async (message, ...args) => {
        try {
            await message.member?.setNickname(args.join(" "));
            message.react(like);
        } catch (e) {
            console.error(e);
        }
    },
};

export default nick;
