import Command from "../Command";
import { Message, MessageEmbed } from "discord.js";
import commands from "../commands";

const embed: MessageEmbed = new MessageEmbed()
    .setColor("#F03A17")
    .setTitle("Comandos");

let first = true;

const help: Command = {
    name: "help",
    description: "Mostra todos os comandos",
    call: (message: Message, ...args: string[]) => {
        if (first) {
            first = false;

            let d = "";
    
            for (const key in commands) {
                const command = commands[key];

                d += `\n**${command.name}**: ${command.description}`;
            }

            embed.setDescription(d);
        }

        message.channel.send(embed);
    }
}

export default help;