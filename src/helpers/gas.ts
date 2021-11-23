import { fetch } from '../util';

export const getBlocknative = async (): Promise<any> => {
  const api = 'https://api.blocknative.com/gasprices/blockprices';
  const apiKey = process.env['BLOCKNATIVE_API_KEY']!;

  try {
    const res = await fetch(api, {
      method: 'GET',
      headers: { Authorization: apiKey }
    });
    if (res.ok) return res.json();
  } catch (error) {
    console.log(error);
  }
};

export const getEtherscan = async () => {
  const apiKey = process.env['ETHERSCAN_API_KEY']!;
  const api = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${apiKey}`;

  try {
    const res = await fetch(api, { method: 'GET' });
    if (res.ok) return res.json();
    return res.result;
  } catch (error) {
    console.log(error);
  }
};

export const getGasPrices = async (): Promise<string> => {
  const gasPrices = await getEtherscan();
  return `⚡${gasPrices.result.FastGasPrice}|🚶${gasPrices.result.ProposeGasPrice}|🐢${gasPrices.result.SafeGasPrice}`;
};
