import { Message, MessageEmbed } from "discord.js";
import Command from "../Command";
import commands from "../commands";
import { botColor } from "../constants";
import { channel as musicChannel } from "../music/musicChannel";

const embed = new MessageEmbed().setColor(botColor).setTitle("Comandos");
const adminEmbed = new MessageEmbed().setColor(botColor).setTitle("Comandos");

let first = true;

const help: Command = {
    name: "help",
    description: "Mostra todos os comandos",
    call: (message: Message, ...args: string[]) => {
        if (first) {
            first = false;
            let d = "",
                ad = "";

            for (const key in commands) {
                const command = commands[key];

                if (!command.admin)
                    d += `\n**${command.name}**: ${command.description}`;
                ad += `\n**${command.name}**: ${command.description}`;
            }

            d += `\n\nPara tocar música usa ${musicChannel}`;
            ad += `\n\nPara tocar música usa ${musicChannel}`;

            embed.setDescription(d);
            adminEmbed.setDescription(ad);
        }

        if (message.member?.hasPermission("ADMINISTRATOR"))
            message.channel.send(adminEmbed);
        else message.channel.send(embed);
    },
};

export default help;
