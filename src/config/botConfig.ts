import CustomClient from '../models/CustomClient';
import IEvent from '../models/IEvent';
import { getDefaultExport, getFilesFromDirectory, setClientCommands } from '../util';

export const client = new CustomClient();

export const initBot = (token: string) => {
  // Load commands
  setClientCommands(client);

  // Load events
  const eventFiles = getFilesFromDirectory('./src/events', '.ts');

  for (const file of eventFiles) {
    const event: IEvent = getDefaultExport('./events', file);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  // Listen for API errors
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
  });

  client.login(token);
};
