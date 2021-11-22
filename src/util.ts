import * as fs from 'fs';

// Used for asynchronous timeouts
export const wait = require('util').promisify(setTimeout);

export const removeFileExtension = (file: string, extension: string): string => {
  const trimSize = extension.length;
  return file.substring(0, file.length - trimSize);
};

// Get all files in a directory (including its subdirectories)
export const getAllFiles = (dirPath: string, parentDir: string, allFiles: string[]) => {
  fs.readdirSync(dirPath).forEach((file) => {
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

// Gets all objects of specified type residing in specified directory
export const getAll = <T>(dir: string, isDefaultExport?: boolean) => {
  const allObjects = getAllFiles(`./src/${dir}`, `${dir}/`, []);
  const objects: T[] = [];

  allObjects
    .filter((file) => file.endsWith('.ts'))
    .forEach((file) => {
      file = removeFileExtension(file, '.ts');
      const object = require(`./${dir}/${file}`);
      isDefaultExport ? objects.push(object.default) : objects.push(object);
    });

  return objects;
};
