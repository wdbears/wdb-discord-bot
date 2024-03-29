import { TextChannel } from 'discord.js';
import { client } from '../config/bot';
import { getGasPrices } from '../helpers/etherscan';
import IEvent from '../models/IEvent';
import { getEnvironmentType } from '../util/environmentType';

const ready: IEvent = {
  name: 'ready',
  once: false,
  execute: (): void => {
    console.log('Ready!');

    if (getEnvironmentType().isProd()) {
      const channel = <TextChannel>client.channels.cache.get('930879495227969546');
      if (channel) channel.send(client.user?.username + ' has successfully deployed!');
    }

    setInterval(async () => {
      const gasPrices = await getGasPrices();
      if (gasPrices) client.user?.setActivity(gasPrices);
    }, 10000);
  }
};

export default ready;
