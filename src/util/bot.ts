import { Guild } from 'discord.js';

export const getEmoji = (guild: Guild | null, emojiName: string) => {
  return guild?.emojis.cache.find((emoji) => emoji.name === emojiName);
};
