import { client } from "../../Uteis/cliente.js";
import { abreviacoesMenores } from "../../Uteis/abreviacoes.js";
import 'dotenv/config';

client.on("messageReactionAdd", async (reaction, user) => {
    try {
        if (reaction.partial) await reaction.fetch();
        if (reaction.message.partial) await reaction.message.fetch();

        const { message } = reaction;

        const canaisPermitidos = [process.env.ID_CANAL_RECRUTAMENTO];
        if (!canaisPermitidos.includes(message.channel.id)) return;
        if (reaction.emoji.name !== "✅") return;

        const guild = message.guild;
        const membroAprovador = await guild.members.fetch(user.id);

        const cargosAutorizados = [process.env.ID_CARGO_SET, process.env.ID_CARGO_PREFEITURA];
        const temPermissao = membroAprovador.roles.cache.some(role =>
            cargosAutorizados.includes(role.name)
        );
        if (!temPermissao) return;

        const conteudo = message.content;
        const regex = /QRA:\s*(.+)\nPassaporte:\s*(\d+)\nDepartamento:\s*(.+)\nPatente:\s*(.+)/i;
        const match = conteudo.match(regex);
        if (!match) return message.reply("❌ Não consegui interpretar os dados da mensagem.");

        const [, qra, passaporte, departamentoNome, patenteNome] = match;
        const membroRegistrado = await guild.members.fetch(message.author.id);

        function limparNomeCargo(nome) {
            return nome
                .normalize("NFD") // separa letras de acentos
                .replace(/[\u0300-\u036f]/g, "") // remove acentos
                .replace(/<@&\d+>/g, "") // remove menções de cargo
                .replace(/@/g, "")       // remove '@'
                .trim()
                .toLowerCase();
        }

        const extrairIdDeMenção = (texto) => {
            const match = texto.match(/<@&(\d+)>/);
            return match ? match[1] : null;
        };

        const idDepartamento = extrairIdDeMenção(departamentoNome);
        const idPatente = extrairIdDeMenção(patenteNome);

        const cargoDepartamento = idDepartamento
            ? guild.roles.cache.get(idDepartamento)
            : guild.roles.cache.find(r => r.name.toLowerCase() === limparNomeCargo(departamentoNome));

        const cargoPatente = idPatente
            ? guild.roles.cache.get(idPatente)
            : guild.roles.cache.find(r => r.name.toLowerCase() === limparNomeCargo(patenteNome));

        if (!cargoDepartamento) return message.reply("❌ Cargo de departamento não encontrado.");
        if (!cargoPatente) return message.reply("❌ Cargo de patente não encontrado.");

        // Buscar o cargo geral 'policia'
        const cargoPolicia = guild.roles.cache.get(process.env.ID_CARGO_POLICIA);
        if (!cargoPolicia) {
            return message.reply("❌ Cargo geral 'policia' não encontrado.");
        }

        // Adiciona todos os cargos juntos
        await membroRegistrado.roles.add([cargoDepartamento, cargoPatente, cargoPolicia]);

        const sigla = abreviacoesMenores[cargoPatente.id] || "CRIA-RJ";

        const novoNick = `${sigla} ${qra} #${passaporte}`;
        await membroRegistrado.setNickname(novoNick).catch(err => {
            console.log(`Erro ao mudar nickname de ${qra}:`, err.message);
        });

        await message.react("✅");
        message.reply(`✅ Registro de ${qra} aprovado com sucesso por ${user.username}.`);
    } catch (error) {
        console.log("Erro ao processar reação: ", error);
    }
});
