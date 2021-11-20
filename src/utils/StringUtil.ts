import * as fs from 'fs'
import { Command } from '../models/Command'

export const removeExtension = (file: string, extension: string): string => {
  // Extension example - .ts
  const trimSize = extension.length
  return file.substring(0, file.length - trimSize)
}

export const getDefaultExport = (file: any): Command => {
  return require(`./commands/${removeExtension(file, '.ts')}`).default
}

export const getFilesFromDirectory = (directoryPath: string, extension: string) => {
  return fs.readdirSync(directoryPath).filter((file) => file.endsWith(extension))
}
