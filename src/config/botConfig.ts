import CustomClient from '../models/CustomClient';
import IEvent from '../models/IEvent';
import { getAllCommands, getAllFiles, removeFileExtension } from '../util';

export const client = new CustomClient();

export const getAllEvents = () => {
  const allEvents = getAllFiles('./src/events', 'events/', []);
  const events: IEvent[] = [];

  allEvents
    .filter((file) => file.endsWith('.ts'))
    .forEach((file) => {
      file = removeFileExtension(file, '.ts');
      events.push(require(`../events/${file}`));
    });

  return events;
};

export const initBot = (token: string) => {
  // Load commands
  getAllCommands().forEach((command) => client.commands.set(command.name, command));

  // Load events
  // const eventFiles = getFilesFromDirectory('./src/events', '.ts');

  getAllEvents().forEach((event) => {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });
  // for (const file of eventFiles) {
  //   const event: IEvent = getDefaultExport('./events', file);
  //   if (event.once) {
  //     client.once(event.name, (...args) => event.execute(...args));
  //   } else {
  //     client.on(event.name, (...args) => event.execute(...args));
  //   }
  // }

  // Listen for API errors
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
  });

  client.login(token);
};
