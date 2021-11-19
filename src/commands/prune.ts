import { CommandInteraction, CacheType } from 'discord.js';
import { ICommand, Command } from '../util/Command';

let prune: ICommand = {
  name: '',
  description: '',
  usage: '',
  aliases: [],
  cooldown: 0,
  argsRequired: false,
  execute: (interaction: CommandInteraction<CacheType>): void => {}
};

export const command = new Command(prune);
