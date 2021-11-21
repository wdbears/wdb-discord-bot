import * as fs from 'fs';
import CustomClient from './models/CustomClient';

export const removeFileExtension = (file: string, extension: string): string => {
  const trimSize = extension.length;
  return file.substring(0, file.length - trimSize);
};

// Note - path is relative to this directory, not where it is called from
export const getDefaultExport = (path: string, file: any): any => {
  return require(`${path}/${removeFileExtension(file, '.ts')}`).default;
};

export const getFilesFromDirectory = (directoryPath: string, extension: string) => {
  return fs.readdirSync(directoryPath).filter((file) => file.endsWith(extension));
};

// Get all files in a directory (including its subdirectories)
export const getAllFiles = (dirPath: string, dir: string, arrayOfFiles: string[]) => {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    if (fs.statSync(`${dirPath}/${file}`).isDirectory()) {
      arrayOfFiles = getAllFiles(`${dirPath}/${file}`, dir, arrayOfFiles);
    } else {
      const simplePath = dirPath.split(dir);
      if (simplePath[1]) {
        // include subdirectory in path
        arrayOfFiles.push(`${simplePath[1]}/${file}`);
      } else {
        arrayOfFiles.push(`${file}`);
      }
    }
  });
  return arrayOfFiles;
};

export const setClientCommands = (client: CustomClient) => {
  const allFiles = getAllFiles('./src/commands', 'commands/', []);
  // Populate commands from commands directory
  const commandFiles = allFiles.filter((file) => file.endsWith('.ts'));
  commandFiles.forEach((file) => {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
  });
};
