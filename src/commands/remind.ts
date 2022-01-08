// import { SlashCommandBuilder } from '@discordjs/builders';
// import { CommandInteraction } from 'discord.js';
// import { Command, ICommand } from '../models/Command';

// const remind: ICommand = {
//   name: 'remind',
//   description: 'sends a reminder ping for a specified interval',
//   data: new SlashCommandBuilder().addSubcommand((subcommand) =>
//     subcommand.setName('server').setDescription('Info about the server')
//   ),
//   execute: async (interaction: CommandInteraction): Promise<void> => {
//     const amount = interaction.options.getInteger('amount')!;
//   }
// };

// export default new Command(remind);
