export const choices: { key: string; value: string }[] = [
  { key: 'anonymice', value: 'anonymicebreeding' },
  { key: 'creepz', value: 'genesis-creepz' },
  { key: 'cryptofoxes', value: 'cryptofoxes-v2' },
  { key: 'cyberkongz', value: 'cyberkongz' },
  { key: 'kaiju', value: 'kaiju-kingz' },
  { key: 'littles', value: 'thelittlesnft' },
  { key: 'nanopass', value: 'projectnanopass' },
  { key: 'niftyleague', value: 'niftydegen' },
  { key: 'noundles', value: 'noundles' },
  { key: 'outeridentities', value: 'neotokyo-outer-identities' },
  { key: 'pixels', value: 'the-pixels-inc' },
  { key: 'pudgypenguins', value: 'pudgypenguins' },
  { key: 'snails', value: 'evosnails-nft' },
  { key: 'syncity', value: 'mobland-genesis-synr-pass' },
  { key: 'zenape', value: 'zenapenft' }
];

export const bluechips: { key: string; value: string }[] = [
  { key: 'azuki', value: 'azuki' },
  { key: 'bakc', value: 'bored-ape-kennel-club' },
  { key: 'bayc', value: 'boredapeyachtclub' },
  { key: 'clonex', value: 'clonex-mintvial' },
  { key: 'coolcats', value: 'cool-cats-nft' },
  { key: 'doodles', value: 'doodles-official' },
  { key: 'mayc', value: 'mutant-ape-yacht-club' }
];

export const allCollections: { key: string; value: string }[] = JSON.parse(JSON.stringify(choices)); // deep copy
allCollections.push(...bluechips);
allCollections.sort((a, b) => {
  if (a.key > b.key) return 1;
  if (a.key < b.key) return -1;
  return 0;
});

// Reverse mappings to lookup simple name; TODO - make it a bidirectional map for cleanup
export const allCollectionsMap: Map<string, string> = new Map();
choices.forEach(({ key, value }) => allCollectionsMap.set(value, key));
bluechips.forEach(({ key, value }) => allCollectionsMap.set(value, key));

export const linkOptions: [key: string, value: string][] = [
  ['jira', 'https://wdbears.atlassian.net/jira/software/projects/WDB/boards/1']
];
