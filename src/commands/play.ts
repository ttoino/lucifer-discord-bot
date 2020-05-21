import Command from "../Command";
import { connectToVoice } from "../util";
import ytdl from "ytdl-core-discord";

const play: Command = {
    name: "play",
    description: "",
    call: async (message, ...args) => {
        (await connectToVoice(message))?.play(await ytdl(args[0]), {type: "opus"});
    }
}

export default play;