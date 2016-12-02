import npm from '../src/index.js';

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
