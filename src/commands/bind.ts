import Command from "../Command";
import { connectToVoice, like } from "../util";

const bind: Command = {
    name: "bind",
    description: "Sons",
    call: async (message, ...args) => {
        try {
            (await connectToVoice(message))?.play(
                `sonszinhos/${args.join(" ")}.mp3`
            );
            like(message);
        } catch (e) {
            console.log(e);
        }
    },
};

export default bind;
