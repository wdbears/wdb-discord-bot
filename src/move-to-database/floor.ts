export const collections: { name: string; value: string; isBlueChip?: boolean }[] = [
  { name: 'anonymice', value: 'anonymicebreeding' },
  { name: 'creepz', value: 'genesis-creepz' },
  { name: 'cryptofoxes', value: 'cryptofoxes-v2' },
  { name: 'cyberkongz', value: 'cyberkongz' },
  { name: 'kaiju', value: 'kaiju-kingz' },
  { name: 'littles', value: 'thelittlesnft' },
  { name: 'nanopass', value: 'projectnanopass' },
  { name: 'niftyleague', value: 'niftydegen' },
  { name: 'noundles', value: 'noundles' },
  { name: 'outeridentities', value: 'neotokyo-outer-identities' },
  { name: 'pixels', value: 'the-pixels-inc' },
  { name: 'pudgypenguins', value: 'pudgypenguins' },
  { name: 'snails', value: 'evosnails-nft' },
  { name: 'syncity', value: 'mobland-genesis-synr-pass' },
  { name: 'zenape', value: 'zenapenft' },
  { name: 'azuki', value: 'azuki', isBlueChip: true },
  { name: 'bakc', value: 'bored-ape-kennel-club', isBlueChip: true },
  { name: 'bayc', value: 'boredapeyachtclub', isBlueChip: true },
  { name: 'clonex', value: 'clonex-mintvial', isBlueChip: true },
  { name: 'coolcats', value: 'cool-cats-nft', isBlueChip: true },
  { name: 'doodles', value: 'doodles-official', isBlueChip: true },
  { name: 'mayc', value: 'mutant-ape-yacht-club', isBlueChip: true }
];

export const sortedCollections: { name: string; value: string }[] = JSON.parse(
  JSON.stringify(collections)
); // deep copy

sortedCollections.sort((a, b) => {
  if (a.name > b.name) return 1;
  if (a.name < b.name) return -1;
  return 0;
});

// Reverse mappings to lookup simple name; TODO - make it a bidirectional map for cleanup
export const collectionsMap: Map<string, string> = new Map();
collections.forEach(({ name, value }) => collectionsMap.set(value, name));

export const linkOptions: { name: string; value: string }[] = [
  { name: 'jira', value: 'https://wdbears.atlassian.net/jira/software/projects/WDB/boards/1' }
];
