import { Client, IntentsBitField, Partials } from 'discord.js';

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.GuildInvites,
    IntentsBitField.Flags.GuildEmojisAndStickers
  ],
  partials: [
    Partials.User,
    Partials.Message,
    Partials.Reaction,
    Partials.Channel,
    Partials.GuildMember
  ]
});
