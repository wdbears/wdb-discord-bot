import { Command, ICommand } from '../../models/Command';
import { fetch } from '../../util/common';

export const getInfo = async (collection: string) => {
  const api = `https://api.opensea.io/api/v1/collection/${collection}/stats?format=json`;
  const res = await fetch(api, { method: 'GET' }).then((res) => res.json());
  return res.stats.floor_price;
};

const nft: ICommand = {
  name: 'nft',
  description: 'Details about a particular NFT collection',
  isEnabled: false,
  execute: async () => {}
};

export default new Command(nft);
