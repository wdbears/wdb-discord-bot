import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { getTransactions } from '../../helpers/etherscan';
import { Command, ICommand } from '../../models/Command';

const contract: ICommand = {
  name: 'contract',
  description: 'Get contract details.',
  data: new SlashCommandBuilder().addStringOption((option) =>
    option.setName('address').setDescription('address to lookup').setRequired(true)
  ),
  execute: async (interaction: CommandInteraction): Promise<void> => {
    try {
      const address: string = interaction.options.getString('address')!;
      let res = await getTransactions(address);
      res = await res.result[0].from;
      res = JSON.stringify(res);
      await interaction.reply(res);
    } catch (error) {
      console.log(error);
    }
  }
};

export default new Command(contract);
