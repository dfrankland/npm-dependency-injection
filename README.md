# `npm-dependency-injection`

A very dumb version of dependency injection for `npm`.

**Please don't use this for anything that is _production_ code.** This is great
for personal tools and projects that need `npm` dependencies without maintaining
a `package.json` (example: [Hyper.app][1]).

## How to use
1.  Import the module

    ```js
    import npm from 'npm-dependency-injection';
    ```

2.  Pass an array of `npm` module dependencies as well as the current working
    directory

    ```js
    // Asynchronous promise based API
    const dependenciesPromise = npm.async(
      ['pokemonsay', 'cat-pad'],
      { output: true, cwd: __dirname },
    );

    // Synchronous API
    const { pokemonsay, 'cat-pad': catPad } = npm.sync(
      ['pokemonsay', 'cat-pad'],
      { output: true, cwd: __dirname },
    );
    ```

3.  If using `async`, wait for the promise to resolve and use your dependencies

    ```js
    dependenciesPromise
      .then(
        dependencies => {
          const { pokemonsay, 'cat-pad': catPad } = dependencies;
          // Do logic here
        }
      )
      .catch(
        err => {
          console.error(err);
          process.exit(1);
        }
      );
    ```

## API

### Methods

*   `sync(arrayOfDependencies, options)`: Synchronous method that returns a
    dependencies object (see below for details).

*   `async(arrayOfDependencies, options)`: Asynchronous method that returns a
    promise which resolves to a dependencies object (see below for details).

### Arguments

*   `arrayOfDependencies`: An array of strings that are the names of `npm`
    modules.

*   `options`: An object with the following properties

    *   `cwd`: String, absolute path to where `npm` modules should be read from,
        saved, or installed to. Defaults to `process.cwd`.

    *   `output`: Boolean, whether to show the output from `npm`; logs using
        `console.log` and `console.error`. Good for debugging purposes.

### Dependencies Object

This is the result of either of the methods above. Keys will be the name of the
`npm` module and values will be the `npm` module after being `require`d. example
below:

```
{
  pokemonsay: {
    default: {
       iChooseYou: [Function: iChooseYou],
       random: [Function: random],
       say: [Function: say]
    }
  },
  'cat-pad': [Function]
}
```

[1]: https://hyper.is/
