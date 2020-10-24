module.exports = {
  name: 'prune',
  description: 'Delete the specified number of messages',
  async execute(message, args) {
    const amount = parseInt(args[0], 10) + 1;
    if (Number.isNaN(amount)) {
      return message.reply("that doesn't seem to be a valid number.");
    }
    if (amount <= 1 || amount > 100) {
      return message.reply('you need to input a number between 1 and 99.');
    }

    try {
      message.channel.bulkDelete(amount, true);
      message.channel.send(`Successfully deleted ${amount - 1} messages!`);
    } catch (error) {
      console.error(error);
      message.channel.send(
        'there was an error trying to prune messages in this channel!'
      );
    }
  }
};
