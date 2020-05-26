import Command from "../Command";
import { like, isLikeReaction } from "../util";

const moveall: Command = {
    name: "moveall",
    description: "",
    call: async (message, ...args) => {
        if (!message.member?.hasPermission("ADMINISTRATOR")) {
            await message.channel.send("Não és digno :imp:");
            return;
        }

        const channel = message.member?.voice.channel;

        if (!channel) {
            await message.channel.send("Precisas de estar num canal de voz :imp:");
            return;
        } else {
            const botMessage = await message.channel.send(`Clica no :thumbsup: para mover todos os utilizadores em **${channel}**`);
            await like(botMessage);

            try {
                await botMessage.awaitReactions(
                    (reaction, user) => isLikeReaction(reaction) && user.id === message.author.id,
                    {
                        max: 1,
                        time: 60000,
                        errors: ["time"]
                    }
                );
                
                const newMember = await message.member.fetch();
                const newChannel = newMember.voice.channel;
                const members = channel.members;

                if (!newChannel) {
                    botMessage.edit("Precisas de estar num canal de voz :imp:");
                    return;
                }

                members.forEach((m) => {
                    m.voice.setChannel(newChannel);
                })

                botMessage.edit(`Os ${members.size} utilizadores em **${channel}** foram movidos para **${newChannel}** :smiling_imp:`);
            } catch (e) {
                botMessage.edit(`Não foste rápido o suficiente :imp:`);
            } finally {
                await botMessage.reactions.removeAll();
            }
        }
    }
}

export default moveall;