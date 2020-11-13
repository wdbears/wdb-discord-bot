export const name = 'prune';
export const description = 'Delete the specified number of messages.';
export const usage = '[number of messages to be deleted]';
export const aliases = ['clear'];

export async function execute(message, args) {
  const amount = parseInt(args[0], 10) + 1;

  if (Number.isNaN(amount))
    return message.reply("that doesn't seem to be a valid number.");

  if (amount <= 1 || amount > 100)
    return message.reply('please input a number between 1 and 99.');

  try {
    message.channel.bulkDelete(amount, true);
    const botMessage = await message.channel.send(
      `Successfully deleted ${amount - 1} messages!`
    );
    botMessage.delete({ timeout: 5000 });
  } catch (error) {
    console.error(error);
    message.channel.send(
      'There was an error trying to prune messages in this channel!'
    );
  }
}
