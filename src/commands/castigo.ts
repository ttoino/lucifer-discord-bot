import Command from "../Command";

const castigo: Command = {
    name: "castigo",
    description: "Envia um gajo para o castigo",
    admin: true,
    call: async (message, ...args) => {
        const m = message.mentions.members?.first();
        const role = message.guild?.roles.cache.find((r) =>
            r.name.endsWith("TESTÍCULO DO GOD")
        );

        if (role) m?.roles.set([role]);

        message.channel.send(`O utilizador ${m} foi castigado :smiling_imp:`);
    },
};

export default castigo;
