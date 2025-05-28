import { ApplicationCommandType, ApplicationCommandOptionType, Embed, EmbedBuilder } from "discord.js"

export default {
  name: 'limpar',
  description: 'Comando para limpar o chat de mensagens', // Coloque a descrição do comando
  type: ApplicationCommandType.ChatInput,
  options: [
    {
        name: 'quantidade',
        description: 'Quantidade de mensagens a ser apagada de 1 a 100',
        type: ApplicationCommandOptionType.Integer,
        required: true,
    }
],

  run: async (client, interaction) => {
    try {
        const qtd = interaction.getInteger("quantidade");

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Chat limpo com sucesso!")

        const embed_err = new EmbedBuilder()
            .setColor("Red")
            .setTitle("Você só pode excluir mensagens em massa com menos de 14 dias.")

        interaction.channel.bulkDelete(qtd)
            .then(() => {
                interaction.reply({embeds: [embed], ephemeral: true})
            })
            .catch((err) => {
                console.log(err)
                if (err.code) {
                    interaction.reply({embeds: [embed_err], ephemeral: true})
                }
            })
    } catch (error) {
        console.log(error)
    }
  }
}