import IEvent from '../models/IEvent';

const ready: IEvent = {
  name: 'ready',
  once: false,
  execute: (): void => {
    console.log('Ready!');
  }
};

export default ready;
