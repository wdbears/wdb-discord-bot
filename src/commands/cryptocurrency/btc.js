import { execute as getCrypto } from './crypto';

export const name = 'btc';
export const description = 'Fetch the current price of Bitcoin.';

export async function execute(message, args) {
  getCrypto(message, 'btc');
}
