import { CommandInteraction, CacheType } from 'discord.js';
import { ICommand, Command } from '../util/Command';

let prune: ICommand = {
  name: 'prune',
  description: 'Delete the specified number of messages.',
  usage: '[Number]',
  aliases: ['clear'],
  cooldown: 0,
  argsRequired: false,
  execute: (interaction: CommandInteraction<CacheType>): void => {
    interaction;
    const amount = parseInt(args[0], 10) + 1;

    if (Number.isNaN(amount)) throw new Error(`${amount} is an invalid number`);
    if (amount <= 1 || amount > 100) throw new Error(`please input a number between 1 and 99`);

    try {
      interaction.channel!.bulkDelete(amount, true);
      const botMessage = await message.channel.send(`Successfully deleted ${amount - 1} messages!`);
      botMessage.delete({ timeout: 5000 });
    } catch (error) {
      throw new WdbError(name, 500);
    }
  }
};

export const command = new Command(prune);
