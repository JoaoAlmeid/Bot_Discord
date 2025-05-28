import { pathToFileURL } from 'url';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async (client) => {
  const SlashsArray = [];

  const folders = await fs.readdir(path.join(__dirname, '../Comandos'));
  
  for (const subfolder of folders) {
    const files = await fs.readdir(path.join(__dirname, '../Comandos', subfolder));

    for (const file of files) {
      if (!file.endsWith('.js')) continue;

      const commandPath = path.join(__dirname, '../Comandos', subfolder, file);

      const command = (await import(pathToFileURL(commandPath).href)).default;

      if (!command?.name) continue;

      client.slashCommands.set(command.name, command);
      SlashsArray.push(command);
    }
  }

  client.on('ready', async () => {
    client.guilds.cache.forEach(guild => guild.commands.set(SlashsArray));
  });
};
