import { prefix } from '../config';

export const name = 'help';
export const description = 'List all of my commands or info about a specific command';
export const aliases = ['commands'];
export const usage = '[command name]';
export const cooldown = 5;

export function execute(message, args) {
  const data = [];
  const { commands } = message.client;

  // List all commands if no command is specified
  if (!args.length) {
    data.push("Here's a list of all my commands:");
    data.push(commands.map((command) => command.name).join(', '));
    data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

    return message.author
      .send(data, { split: true })
      .then(() => {
        if (message.channel.type === 'dm') return;
        message.reply("I've sent you a DM with all my commands!");
      })
      .catch((error) => {
        console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
        message.reply("It seems like I can't DM you. Do you have DMs disabled?");
      });
  }

  const cmdName = args[0].toLowerCase();
  const command = commands.get(cmdName) || commands.find((c) => c.aliases && c.aliases.includes(cmdName));

  if (!command) {
    return message.reply("that's not a valid command!");
  }

  data.push(`**Name:** ${command.cmdName}`);

  if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
  if (command.description) data.push(`**Description:** ${command.description}`);
  if (command.usage) data.push(`**Usage:** ${prefix}${command.cmdName} ${command.usage}`);

  data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

  message.channel.send(data, { split: true });
}
