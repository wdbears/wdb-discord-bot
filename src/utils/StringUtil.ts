import * as fs from 'fs'

export const removeExtension = (file: string, extension: string): string => {
  // Extension example - .ts
  const trimSize = extension.length
  return file.substring(0, file.length - trimSize)
}

// Note - path is relative to this directory, not where it is called from
export const getDefaultExport = (path: string, file: any): any => {
  return require(`${path}/${removeExtension(file, '.ts')}`).default
}

export const getFilesFromDirectory = (directoryPath: string, extension: string) => {
  return fs.readdirSync(directoryPath).filter((file) => file.endsWith(extension))
}
