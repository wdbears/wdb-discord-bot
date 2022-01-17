import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command, ICommand } from '../../models/Command';
import { linkOptions } from '../../move-to-database/floor';

const links: ICommand = {
  name: 'links',
  description: 'Get dev related links.',
  data: new SlashCommandBuilder().addStringOption((option) =>
    option
      .setName('link')
      .setDescription('Specify which link you want to get.')
      .setRequired(true)
      .addChoices(linkOptions)
  ),
  execute: async (interaction: CommandInteraction): Promise<void> => {
    const link: string = interaction.options.getString('link')!;
    await interaction.reply(`${link}`);
  }
};

export default new Command(links);
