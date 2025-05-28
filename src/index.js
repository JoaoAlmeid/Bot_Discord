import 'dotenv/config';
import { Collection, InteractionType } from 'discord.js';
import { client } from './Uteis/cliente.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Emular __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

client.slashCommands = new Collection();

// Registrar interações
client.on('interactionCreate', async (interaction) => {
  if (interaction.type === InteractionType.ApplicationCommand) {
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd) return interaction.reply('Error');

    interaction.member = interaction.guild.members.cache.get(interaction.user.id);

    cmd.run(client, interaction);
  }
});

// Importar handler
import handler from './handler/index.js';
await handler(client);

// Carregar eventos dinamicamente
const eventosDir = path.join(__dirname, './Eventos');
const eventos = await fs.readdir(eventosDir);

for (const evento of eventos) {
  const eventoPath = path.join(eventosDir, evento);
  const { default: eventFn } = await import(pathToFileURL(eventoPath).href);
  if (typeof eventFn === 'function') eventFn(client);
}

// Login
client.login(process.env.TOKEN_DISCORD);
