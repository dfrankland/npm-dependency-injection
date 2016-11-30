import getDependencies from '../dist/index.js';

(async () => {
  const {
    pokemonsay,
    'image-xterm-loader': imageXtermLoader,
    lastpass,
  } = await getDependencies([
    'pokemonsay',
    'lastpass',
  ], {
    cwd: __dirname,
    output: true,
  });

  console.log(pokemonsay, lastpass);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
