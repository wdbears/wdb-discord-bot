import { execute as getCrypto } from './crypto';

export const name = 'eth';
export const description = 'Fetch the current price of Ethereum.';

// eslint-disable-next-line no-unused-vars
export async function execute(message, args) {
  getCrypto(message, 'eth');
}
