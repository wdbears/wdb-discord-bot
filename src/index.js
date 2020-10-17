import dotenv from 'dotenv'
import Discord from 'discord.js'
import ytdl from 'ytdl-core'

dotenv.config() // Load instance variables

// Create an instance of a Discord client
const client = new Discord.Client()

client.on('ready', () => {
  console.log('Nom Nom is ready to munch, mmm~')
})

client.on('message', async (message) => {
  if (message.channel.name === 'bot-commands') {
    const messageIgnoreCase = message.content.toUpperCase()

    switch (messageIgnoreCase) {
      case 'MONKE': {
        const connection = await message.member.voice.channel.join()
        const dispatcher = connection.play(
          ytdl('https://www.youtube.com/watch?v=Xz1iSC-UFtk', {
            filter: 'audioonly',
          })
        )
        // End of the stream
        dispatcher.on('finish', () => {
          console.log('Finished playing!')
          dispatcher.destroy()
          message.member.voice.channel.leave()
        })
        break
      }

      default:
        break
    }
  }
})

client.login(process.env.DISCORD_CLIENT_ID)
