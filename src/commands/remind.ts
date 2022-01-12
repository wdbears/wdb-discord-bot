import { CommandInteraction, GuildMember, Role, TextChannel } from 'discord.js';
import { Command, ICommand } from '../models/Command';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
  DEFAULT_TIMEZONE_OFFSET,
  getFormattedTime,
  getZoneAdjustedTime,
  parseTime
} from '../helpers/time';
import { ChannelType } from 'discord-api-types';

const remind: ICommand = {
  name: 'remind',
  description: 'sends a reminder ping for a specified interval',
  data: new SlashCommandBuilder()
    .addStringOption((option) =>
      option
        .setName('event')
        .setDescription('Event name for which reminder is for')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('time').setDescription('Time for which reminder is set for').setRequired(true)
    )
    .addMentionableOption((option) =>
      option.setName('user').setDescription('The user the reminder is for').setRequired(false)
    )
    .addRoleOption((option) =>
      option.setName('role').setDescription('The role the reminder is for').setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .addChannelType(ChannelType.GuildText)
        .setName('channel')
        .setDescription('The channel the reminder will be sent in')
        .setRequired(false)
    ),
  execute: async (interaction: CommandInteraction): Promise<void> => {
    const eventName = interaction.options.getString('event')!;
    const userInputtedTime = interaction.options.getString('time');

    try {
      const time: Date = parseTime(userInputtedTime!);
      queueReminder(interaction, time, eventName);
      await interaction.reply(`${eventName} reminder is set for ${getFormattedTime(time)}`);
    } catch (e: unknown) {
      if (e instanceof Error) {
        await interaction.reply(e.message);
      }
    }
  }
};

const queueReminder = (interaction: CommandInteraction, time: Date, eventName: string) => {
  const channel = <TextChannel>interaction.options.getChannel('channel') || interaction.channel;
  const userMention = <GuildMember>interaction.options.getMentionable('user');
  const roleMention = <Role>interaction.options.getRole('role');

  if (time.getTime() <= Date.now()) {
    throw new Error('Reminder should come after the current time!');
  }

  const currentTime = getZoneAdjustedTime(Date.now(), DEFAULT_TIMEZONE_OFFSET).getTime();
  const alertTime = getZoneAdjustedTime(time.getTime(), DEFAULT_TIMEZONE_OFFSET).getTime();

  let res = '';

  res += userMention != null ? `${userMention.user} ` : `${interaction.user} `;

  if (roleMention != null) res += `${roleMention} `;

  res += `${eventName} event is happening now!`;

  setTimeout(() => {
    channel!.send(res);
  }, alertTime - currentTime);
};

export default new Command(remind);
