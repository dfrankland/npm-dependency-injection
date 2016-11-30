import getDependencies from '../dist/index.js';

(async () => {
  const {
    pokemonsay,
    lastpass,
  } = await getDependencies([
    'pokemonsay',
    'lastpass',
  ], {
    output: true,
  });

  console.log(pokemonsay, lastpass);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
