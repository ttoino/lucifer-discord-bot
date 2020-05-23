import Command from "../Command";
import { connectToVoice, like } from "../util";
import ytdl from "ytdl-core-discord";

const play: Command = {
    name: "play",
    description: "",
    call: async (message, ...args) => {
        try {
            (await connectToVoice(message))?.play(await ytdl(args[0]), {type: "opus"});
            like(message);
        } catch (e) {
            console.log(e);
        }
    }
}

export default play;