// import ytdl from "ytdl-core-discord";
import Command from "../Command";

const play: Command = {
    name: "play",
    description: "",
    call: async (message, ...args) => {
        // try {
        //     (await connectToVoice(message))?.play(await ytdl(args[0]), {
        //         type: "opus",
        //     });
        //     like(message);
        // } catch (e) {
        //     console.log(e);
        // }
    },
};

export default play;
