/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs';

// Used for asynchronous timeouts
export const wait = require('util').promisify(setTimeout);

// alternative way of importing node-fetch since it uses ESM3 (not supported in current config)
const _importDynamic = new Function('modulePath', 'return import(modulePath)');
export async function fetch(...args: any) {
  const { default: fetch } = await _importDynamic('node-fetch');
  return fetch(...args);
}

export const removeFileExtension = (file: string, extension: string): string => {
  const trimSize = extension.length;
  return file.substring(0, file.length - trimSize);
};

// Get all files in a directory (including its subdirectories)
export const getAllFiles = (dirPath: string, parentDir: string, allFiles: string[]): string[] => {
  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = `${dirPath}/${file}`;

    // Recursively call this method for all subdirectories
    if (fs.statSync(filePath).isDirectory()) {
      allFiles = getAllFiles(filePath, parentDir, allFiles);
      return;
    }

    // Check if file is in a subdirectory
    const subdirectoryPath = dirPath.split(parentDir)[1];

    // If it is, include the file's subdirectory to the path
    subdirectoryPath ? allFiles.push(`${subdirectoryPath}/${file}`) : allFiles.push(file);
  });
  return allFiles;
};

// Gets a map of all objects of a specified type residing in the given directory
export const getAll = <T>(dir: string, isDefaultExport?: boolean): Map<string, T> => {
  const allObjects = getAllFiles(`./src/${dir}`, `${dir}/`, []);
  const fileToObjectMap = new Map<string, T>();

  allObjects
    .filter((file) => file.endsWith('.ts'))
    .forEach((file) => {
      file = removeFileExtension(file, '.ts');
      const object = require(`./${dir}/${file}`);
      if (isDefaultExport) {
        fileToObjectMap.set(file, object.default);
      } else {
        fileToObjectMap.set(file, object);
      }
    });

  return fileToObjectMap;
};
