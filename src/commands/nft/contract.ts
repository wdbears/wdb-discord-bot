import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command, ICommand } from '../../models/Command';
import { getTransactions } from '../../helpers/etherscan';

const contract: ICommand = {
  name: 'contract',
  description: 'Get contract details.',
  data: new SlashCommandBuilder().addStringOption((option) =>
    option.setName('address').setDescription('address to lookup').setRequired(true)
  ),
  isEnabled: true,
  execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
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
