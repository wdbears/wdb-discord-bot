import * as fs from 'fs'
import { Command } from '../models/Command'
import CustomClient from '../models/CustomClient'
import IEvent from '../models/IEvent'
import { removeExtension } from '../utils/StringUtil'

export const client = new CustomClient()

export const botConfig = (token: string) => {
  // Load commands
  const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.ts'))

  for (const file of commandFiles) {
    const command: Command = require(`../commands/${removeExtension(file, '.ts')}`).default
    client.commands.set(command.name, command)
  }

  // Load events
  const eventFiles = fs.readdirSync('./src/events').filter((file) => file.endsWith('.ts'))

  for (const file of eventFiles) {
    const event: IEvent = require(`../events/${removeExtension(file, '.ts')}`).default
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
