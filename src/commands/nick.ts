import Command from "../Command";

const nick: Command = {
    name: "nick",
    description: "Muda o teu nickname",
    call: async (message, ...args) => {
        try {
            const n = await message.member?.setNickname(args.join(" "));
            message.react("👍");
        } catch (e) {
            console.log(e);
        }
    }
}

export default nick;