import npm from './npm';

const defaultErrorMessage = '`npm-dependency-injection` had an issue';
const defaultErrorSuggestion = 'Pass `output: true` in the options to see more details.';

const getError = message => new Error(
  `${defaultErrorMessage} ${message}.\n${defaultErrorSuggestion}`
);

export default async (dependencies, options) => {
  let installedDependencies = [];
  try {
    installedDependencies = await npm.list(options.cwd);
  } catch (err) {
    throw getError(`finding installed \`npm\` modules in \`${options.cwd}\``);
  }

  const dependenciesToInstall = dependencies.filter(
    dependency => !installedDependencies.includes(dependency)
  );

  try {
    await npm.install(dependencies, options);
  } catch (err) {
    throw getError(`installing \`npm\` dependencies to \`${options.cwd}\``);
  }

  return dependencies.reduce(
    (dependenyObject, nextDependeny) => {
      const newDependenyObject = { ...dependenyObject };
      newDependenyObject[nextDependeny] = require(nextDependeny);
      return newDependenyObject;
    }, {}
  );
};
