const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ghPages = require('gh-pages');

const remote = 'origin';
const branch = 'gh-pages';
const buildDirectory = path.resolve(__dirname, '..', 'build');

function runGit(args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch (error) {
    const details = error.stderr?.toString().trim() || error.message;
    throw new Error(`Git command failed: ${details}`);
  }
}

function getRemoteCommit() {
  const output = runGit(['ls-remote', '--heads', remote, branch]);
  return output ? output.split(/\s+/)[0] : null;
}

function verifyBuildOutput() {
  const requiredPaths = [
    'index.html',
    '404.html',
    path.join('static', 'css'),
    path.join('static', 'js'),
    path.join('static', 'media'),
  ];
  const missingPaths = requiredPaths.filter(
    (relativePath) => !fs.existsSync(path.join(buildDirectory, relativePath)),
  );

  if (missingPaths.length > 0) {
    throw new Error(
      `Production build is incomplete; missing: ${missingPaths.join(', ')}`,
    );
  }
}

function publishBuild() {
  return new Promise((resolve, reject) => {
    ghPages.publish(
      buildDirectory,
      {
        branch,
        message: 'Deploy current production build',
        nojekyll: true,
        remote,
      },
      (error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      },
    );
  });
}

async function deploy() {
  verifyBuildOutput();

  const remoteUrl = runGit(['remote', 'get-url', remote]);
  const previousCommit = getRemoteCommit();

  console.log(`Publishing ${buildDirectory}`);
  console.log(`Target: ${remoteUrl} (${branch})`);

  await publishBuild();

  const deployedCommit = getRemoteCommit();
  if (!deployedCommit) {
    throw new Error(`Remote branch ${branch} was not found after publishing.`);
  }

  if (deployedCommit === previousCommit) {
    console.log(
      `No deployment commit was needed; production files already match ${deployedCommit}.`,
    );
    console.log('No new GitHub Pages run is expected for an unchanged commit.');
    return;
  }

  console.log(`Remote deployment updated: ${previousCommit} -> ${deployedCommit}`);
}

deploy().catch((error) => {
  console.error(`Deployment failed: ${error.message}`);
  process.exitCode = 1;
});
