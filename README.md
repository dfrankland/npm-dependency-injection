# `npm-dependency-injection`

A very dumb version of dependency injection for `npm`.

**Please don't use this for anything that is _production_ code.** This is great
for personal tools and projects that need `npm` dependencies without maintaining
a `package.json` (example: [Hyper.app][1]).

## How to use
1.  Import the module

    ```js
    import getDependencies from 'npm-dependency-injection';
    ```

2.  Pass an array of `npm` module dependencies as well as the current working
    directory

    ```js
    const dependenciesPromise = getDependencies(
      ['pokemonsay', 'cat-pad'],
      { output: true, cwd: __dirname },
    );
    ```

3.  Wait for the promise to resolve and use your dependencies

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

```js
getDependencies(arrayOfDependencies, options);
```

*   `arrayOfDependencies`: An array of strings that are the names of `npm`
    modules.

*   `options`: An object with the following properties

    *   `cwd`: String, absolute path to where `npm` modules should be read from,
        saved, or installed to. Defaults to `process.cwd`.

    *   `output`: Boolean, whether to show the output from `npm`. Good for,
        debugging purposes.

[1]: https://hyper.is/
