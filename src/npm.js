import { spawn, spawnSync } from 'child_process';

const checkDependencies = dependencies => {
  if (!Array.isArray(dependencies) || dependencies.length < 1) {
    throw new Error('No packages listed.');
  }
};

const getDependenciesFromString = string => {
  const json = JSON.parse(string);
  const dependencies = json.dependencies || {};
  return Object.keys(dependencies);
};

const outSync = (output, out, err) => {
  if (output) {
    if (out) console.log(out);
    if (err) console.error(err);
  }
};

const outAsync = (output, child) => {
  if (output) {
    let stdout = '';
    child.stdout.on('data', data => stdout += data);

    let stderr = '';
    child.stderr.on('data', data => stderr += data);

    child.on('close', code => {
      console.log(stdout);
      console.error(stderr);
    });
  }
};

export default {
  list: (cwd, output, env) => new Promise(
    (resolve, reject) => {
      const child = spawn(
        'npm',
        ['ls', '--depth=0', '--json'],
        { cwd, env }
      );

      outAsync(output, child);

      let stdout = '';
      child.stdout.on(
        'data',
        data => {
          stdout += data;
        },
      );

      let error;
      child.on(
        'error',
        err => {
          error = err;
        }
      );

      child.on('close', code => {
        try {
          resolve(
            getDependenciesFromString(stdout)
          );
        } catch (err) {
          reject(error ? error : err);
        }
      });
    }
  ),

  install: async (dependencies, cwd, output, env) => {
    checkDependencies(dependencies);
    return new Promise(
      (resolve, reject) => {
        const child = spawn(
          'npm',
          ['install', ...dependencies],
          { cwd, env }
        );
        outAsync(output, child);
        child.on('error', err => reject(err));
        child.on('close', code => resolve(code));
      }
    );
  },

  listSync: (cwd, output, env) => {
    const { stdout, stderr, error } = spawnSync(
      'npm',
      ['ls', '--depth=0', '--json'],
      { cwd, encoding: 'utf8', env }
    );
    outSync(output, stdout, stderr);
    try {
      return getDependenciesFromString(stdout);
    } catch (err) {
      throw error ? error : err;
    }
  },

  installSync: (dependencies, cwd, output, env) => {
    checkDependencies(dependencies);
    const { stdout, stderr, error } = spawnSync(
      'npm',
      ['install', ...dependencies],
      { cwd, encoding: 'utf8', env }
    );
    outSync(output, stdout, stderr);
    if (error) throw error;
  },
};
