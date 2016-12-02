import npm from '../src/index.js';

console.log('# Begin Sync Test');

(() => {
  const {
    pokemonsay,
    lastpass,
  } = npm.sync([
    'pokemonsay',
    'lastpass',
  ], {
    cwd: process.cwd(),
    output: true,
  });

  console.log(pokemonsay, lastpass);
})();

console.log('# Begin Async Test');

(async () => {
  const {
    pokemonsay,
    lastpass,
  } = await npm.async([
    'pokemonsay',
    'lastpass',
  ], {
    cwd: process.cwd(),
    output: true,
  });

  console.log(pokemonsay, lastpass);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
