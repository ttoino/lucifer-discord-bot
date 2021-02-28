import { Message, MessageReaction } from "discord.js";

export async function connectToVoice(message: Message) {
    if (message.member?.voice.channel) {
        return await message.member.voice.channel.join();
    }
}

export function compareReactionEmoji(
    reaction: MessageReaction,
    emoji: string | string[]
) {
    if (typeof emoji == "string") return reaction.emoji.name == emoji;
    return emoji.includes(reaction.emoji.name);
}
