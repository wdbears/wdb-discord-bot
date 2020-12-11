module.exports = {
  name: 'piconly',
  description: 'Delete all messages with no attachments',
  async execute(message) {
    // cat channel id check
    if (message.channel.id === '770813734200672297') {
      message.channel.messages.fetch({ limit: 100 }).then((collected) => {
        collected.forEach((msg) => {
          // if no attachments or if author is not pom
          if (msg.attachments.size === 0 || msg.author.id !== '182747549101326336') msg.delete();
        });
      });
    } else {
      console.log('Wrong channel');
    }
  }
};
