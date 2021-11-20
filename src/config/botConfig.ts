import { Command } from '../models/Command'
import CustomClient from '../models/CustomClient'
import IEvent from '../models/IEvent'
import { getDefaultExport, getFilesFromDirectory } from '../utils/StringUtil'

export const client = new CustomClient()

export const botConfig = (token: string) => {
  // Load commands
  const commandFiles = getFilesFromDirectory('./src/commands', '.ts')

  for (const file of commandFiles) {
    const command: Command = getDefaultExport('../commands', file)
    client.commands.set(command.name, command)
  }

  // Load events
  const eventFiles = getFilesFromDirectory('./src/events', '.ts')

  for (const file of eventFiles) {
    const event: IEvent = getDefaultExport('../events', file)
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args))
    } else {
      client.on(event.name, (...args) => event.execute(...args))
    }
  }

  // Listen for API errors
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error)
  })

  client.login(token)
}
