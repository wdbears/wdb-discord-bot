import { Command } from '../models/Command';
import CustomClient from '../models/CustomClient';
import IEvent from '../models/IEvent';
import { getAll } from '../util';

export const client = new CustomClient();

export const initBot = async (token: string) => {
  // Load commands
  getAll<Command>('commands', true).forEach((command: Command, _fileName: string) => {
    if (command == null) {
      console.log(`Something went wrong trying to load the following command: ${_fileName}`);
      return;
    }
    client.commands.set(command.name, command);
  });

  // Load events
  getAll<IEvent>('events', true).forEach((event: IEvent, _fileName: string) => {
    if (event == null) {
      console.log(`Something went wrong trying to load the following event: ${_fileName}`);
      return;
    }
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  });

  // Listen for API errors
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled promise rejection:', error);
  });

  await client.login(token);
};
