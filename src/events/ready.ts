import { client } from '../config/bot';
import { getGasPrices } from '../helpers/etherscan';
import IEvent from '../models/IEvent';

const ready: IEvent = {
  name: 'ready',
  once: false,
  execute: (): void => {
    console.log('Ready!');

    setInterval(async () => {
      const gasPrices = await getGasPrices();
      if (gasPrices) client.user?.setActivity(gasPrices);
    }, 10000);
  }
};

export default ready;
