import Command from "../Command";
import { like } from "../constants";
import { connectToVoice } from "../util";

const bind: Command = {
    name: "bind",
    description: "Sons",
    call: async (message, ...args) => {
        try {
            (await connectToVoice(message))?.play(
                `sonszinhos/${args.join(" ")}.mp3`
            );
            message.react(like);
        } catch (e) {
            console.log(e);
        }
    },
};

export default bind;
