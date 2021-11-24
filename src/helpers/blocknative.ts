import { fetch } from '../util';

export const getGas = async (): Promise<any> => {
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
