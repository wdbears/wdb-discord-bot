import { client } from '../config/botConfig';
import { getGasPrices } from '../helpers/gas';
import IEvent from '../models/IEvent';

const ready: IEvent = {
  name: 'ready',
  once: false,
  execute: (): void => {
    console.log('Ready!');

    setInterval(async () => {
      let gasPrices = await getGasPrices();
      client.user?.setActivity(gasPrices);
    }, 10000);
  }
};

export default ready;
