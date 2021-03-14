export const nameSorter = (searchTerm) => (a, b) =>
  a.name === searchTerm ? -1 : b.name === searchTerm ? 1 : 0;
