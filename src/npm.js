import { exec } from 'child_process';

export default {
  list: (cwd = process.cwd, { output } = {}) => new Promise(
    (resolve, reject) => {
      const child = exec(
        'npm ls --depth=0 --json',
        { cwd },
        (error, stdout) => {
          try {
            const json = JSON.parse(stdout);
            const dependencies = json.dependencies || {};
            resolve(Object.keys(dependencies));
          } catch (err) {
            reject(error);
          }
        }
      );

      if (output) {
        child.stdout.on('data', data => console.log(data));
        child.stderr.on('data', data => console.error(data));
      }
    }
  ),

  install: async (dependencies, { cwd = process.cwd, output } = {}) => {
    if (!Array.isArray(dependencies) || dependencies.length < 1) {
      throw new Error('No packages listed.');
    }

    return new Promise(
      (resolve, reject) => {
        const child = exec(
          `npm install ${dependencies.join(' ')}`,
          { cwd },
          error => error ? reject(error) : resolve(),
        );

        if (output) {
          child.stdout.on('data', data => console.log(data));
          child.stderr.on('data', data => console.error(data));
        }
      }
    );
  },
};
