import { Message } from "discord.js"

export async function connectToVoice(message: Message) {
    if (message.member?.voice.channel) {
        return await message.member.voice.channel.join();
    }
}

export async function like(message: Message) {
    return await message.react("👍");
}