import npm from './npm';
import { join as joinPath } from 'path';

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

const requireAll = (cwd, dependencies) =>
  dependencies.reduce(
    (dependencyObject, nextDependency) => {
      const newDependencyObject = { ...dependencyObject };

      let dependency = {};
      const firstPath = joinPath(cwd, 'node_modules', nextDependency);
      try {
        dependency = require(firstPath);
      } catch (err1) {
        const secondPath = joinPath(cwd, nextDependency);
        try {
          dependency = require(secondPath);
        } catch (err2) {
          try {
            dependency = require(nextDependency);
          } catch (err3) {
            throw new Error(
              [
                `Could not \`require\` module \'${nextDependency}\' globally or from:`,
                firstPath,
                secondPath,
              ].join('\n')
            );
          }
        }
      }

      newDependencyObject[nextDependency] = dependency;
      return newDependencyObject;
    }, {}
  );

export default {
  async: async (dependencies, { cwd = process.cwd(), output, env } = {}) => {
    let installedDependencies = [];
    try {
      installedDependencies = await npm.list(cwd, output, env);
    } catch (err) {
      throw getFindError(cwd, err);
    }

    const dependenciesToInstall = findDependenciesToInstall(dependencies, installedDependencies);

    if (dependenciesToInstall.length > 0) {
      try {
        await npm.install(dependenciesToInstall, cwd, output, env);
      } catch (err) {
        throw getInstallError(cwd, err);
      }
    }

    return requireAll(cwd, dependencies);
  },

  sync: (dependencies, { cwd = process.cwd(), output, env } = {}) => {
    let installedDependencies = [];
    try {
      installedDependencies = npm.listSync(cwd, output, env);
    } catch (err) {
      throw getFindError(cwd, err);
    }

    const dependenciesToInstall = findDependenciesToInstall(dependencies, installedDependencies);

    if (dependenciesToInstall.length > 0) {
      try {
        npm.installSync(dependenciesToInstall, cwd, output, env);
      } catch (err) {
        throw getInstallError(cwd, err);
      }
    }

    return requireAll(cwd, dependencies);
  },
};
