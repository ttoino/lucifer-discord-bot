import Command from "../Command";
import { connectToVoice } from "../util";

const bind: Command = {
    name: "bind",
    description: "Sons",
    call: async (message, ...args) => {
        (await connectToVoice(message))?.play(`sonszinhos/${args.join(" ")}.mp3`);
    }
};

export default bind;