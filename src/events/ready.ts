import { client } from '../config/bot';
import { getGasPrices } from '../helpers/etherscan';
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
