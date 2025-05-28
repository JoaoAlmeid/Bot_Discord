import { 
  ApplicationCommandType,
  EmbedBuilder 
} from "discord.js";

export default {
  name: "ping",
  description: "Veja o ping do bot.",
  type: ApplicationCommandType.ChatInput,

  run: async (client, interaction) => {
    const ping = client.ws.ping;

    const embed_1 = new EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`Olá ${interaction.user}, meu ping está em \`calculando...\`.`)
      .setColor("Random");

    const embed_2 = new EmbedBuilder()
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setDescription(`Olá ${interaction.user}, meu ping está em \`${ping}ms\`.`)
      .setColor("Random");

    interaction.reply({ embeds: [embed_1] }).then( () => {
      setTimeout( () => {
        interaction.editReply({ embeds: [embed_2] })
      }, 2000)
    })
  }
}