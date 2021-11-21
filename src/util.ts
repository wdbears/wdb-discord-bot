import * as fs from 'fs';
import { Command } from './models/Command';

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
export const getAllFiles = (dirPath: string, parentDir: string, allFiles: string[]) => {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = `${dirPath}/${file}`;

    // Recursively call this method for all subdirectories
    if (fs.statSync(filePath).isDirectory()) {
      allFiles = getAllFiles(filePath, parentDir, allFiles);
      return;
    }

    // Check if file is in a subdirectory
    const subdirectoryPath = dirPath.split(parentDir)[1];

    // If it is, include the files subdirectory to the path
    subdirectoryPath ? allFiles.push(`${subdirectoryPath}/${file}`) : allFiles.push(file);
  });
  return allFiles;
};

// export const setClientCommands = (client: CustomClient) => {
//   // Populate commands from commands directory
//   const allFiles = getAllFiles('./src/commands', 'commands/', []);
//   const commandFiles: string[] = [];
//   allFiles
//     .filter((file) => file.endsWith('.ts'))
//     .forEach((file) => commandFiles.push(removeFileExtension(file, '.ts')));

//   commandFiles.forEach((file) => {
//     const command = require(`./commands/${file}`);
//     client.commands.set(command.name, command);
//   });
// };

export const getAllCommands = () => {
  const allCommands = getAllFiles('./src/commands', 'commands/', []);
  const commands: Command[] = [];

  console.log(allCommands);

  allCommands
    .filter((file) => file.endsWith('.ts'))
    .forEach((file) => {
      file = removeFileExtension(file, '.ts');
      commands.push(require(`./commands/${file}`));
    });

  return commands;
};

console.log(getAllFiles('./src/events', 'events/', []));
