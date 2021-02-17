import { Message, MessageReaction } from "discord.js";

export async function connectToVoice(message: Message) {
    if (message.member?.voice.channel) {
        return await message.member.voice.channel.join();
    }
}

export async function like(message: Message) {
    return await message.react("👍");
}

export function isLikeReaction(reaction: MessageReaction) {
    return reaction.emoji.name == "👍";
}

export async function dislike(message: Message) {
    return await message.react("👎");
}

export function isDislikeReaction(reaction: MessageReaction) {
    return reaction.emoji.name == "👎";
}
