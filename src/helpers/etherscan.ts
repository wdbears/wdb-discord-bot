import { fetch } from '../util';

const isProd = process.env['NODE_ENV'] === 'production';
const apiKey = isProd ? process.env['ETHERSCAN_API_KEY']! : '';

export const getGas = async () => {
  const api = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${apiKey}`;
  try {
    const res = await fetch(api, { method: 'GET' });
    if (res.ok) return res.json();
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const getGasPrices = async () => {
  const gas = await getGas();
  if (gas == null) return null;
  return `⚡${gas.result.FastGasPrice}|🚶${gas.result.ProposeGasPrice}|🐢${gas.result.SafeGasPrice}`;
};

export const getTransactions = async (address: string) => {
  const api = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${apiKey}`;

  try {
    const res = await fetch(api, { method: 'GET' });
    if (res.ok) return res.json();
    return res.result;
  } catch (error) {
    console.log(error);
  }
};
