import Command from "../Command";
import { like } from "../constants";

const nick: Command = {
    name: "nick",
    description: "Muda o teu nickname",
    call: async (message, ...args) => {
        try {
            const n = await message.member?.setNickname(args.join(" "));
            message.react(like);
        } catch (e) {
            console.log(e);
        }
    },
};

export default nick;
