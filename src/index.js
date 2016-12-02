import npm from './npm';

const defaultErrorMessage = '`npm-dependency-injection` had an issue';
const defaultErrorSuggestion = 'Pass `output: true` in the options to see more details.';

const getError = (message, err) => new Error(
  `${defaultErrorMessage} ${message}.\n${defaultErrorSuggestion}\n${err ? err : ''}`
);

const getFindError = (cwd, err) =>
  getError(`finding installed \`npm\` modules in \`${cwd}\``);

const getInstallError = (cwd, err) =>
  getError(`installing \`npm\` dependencies to \`${cwd}\``, err);

const findDependenciesToInstall = (dependencies, installedDependencies) =>
  dependencies.filter(
    dependency => !installedDependencies.includes(dependency)
  );

const requireAll = dependencies =>
  dependencies.reduce(
    (dependencyObject, nextDependency) => {
      const newDependencyObject = { ...dependencyObject };
      newDependencyObject[nextDependency] = require(nextDependency);
      return newDependencyObject;
    }, {}
  );

export default {
  async: async (dependencies, options) => {
    let installedDependencies = [];
    try {
      installedDependencies = await npm.list(options.cwd, options);
    } catch (err) {
      throw getFindError(options.cwd, err);
    }

    const dependenciesToInstall = findDependenciesToInstall(dependencies, installedDependencies);

    if (dependenciesToInstall.length > 0) {
      try {
        await npm.install(dependenciesToInstall, options);
      } catch (err) {
        throw getInstallError(options.cwd, err);
      }
    }

    return requireAll(dependencies);
  },

  sync: (dependencies, options) => {
    let installedDependencies = [];
    try {
      installedDependencies = npm.listSync(options.cwd, options);
    } catch (err) {
      throw getFindError(options.cwd, err);
    }

    const dependenciesToInstall = findDependenciesToInstall(dependencies, installedDependencies);

    if (dependenciesToInstall.length > 0) {
      try {
        npm.installSync(dependenciesToInstall, options);
      } catch (err) {
        throw getInstallError(options.cwd, err);
      }
    }

    return requireAll(dependencies);
  },
};
