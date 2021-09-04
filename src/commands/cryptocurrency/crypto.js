import fetch from 'node-fetch';

const getCrypto = async (crypto) => {
  const api = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${crypto}&tsyms=USD`;
  try {
    const response = await fetch(api, { method: 'GET' });
    if (response.ok) return response.json();
  } catch (err) {
    console.error(err);
  }
};

const formatResult = (result) => {
  const results = [];

  Object.entries(result).forEach(([key, value]) => {
    const currentPrice = Object.values(value);
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    results.push(`${key}: ${formatter.format(currentPrice)}`);
  });

  return results;
};

export const name = 'crypto';
export const description = 'Fetch the current price of a given cryptocurrency.';
export const usage = '[crypto]';
export const aliases = '[c]';
export const argsRequired = true;

export async function execute(message, args) {
  try {
    const keyword = args.toString().replace(/_/g, ',').toUpperCase();
    if (keyword) {
      const result = formatResult(await getCrypto(keyword));
      message.channel.send(result);
    }
  } catch (error) {
    console.log(error);
  }
}
