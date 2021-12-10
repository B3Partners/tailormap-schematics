const path = require('path');
const { runCommand, checkCleanGitRepo } = require("./shared");

checkCleanGitRepo();

runCommand('npm', ['version', 'patch'])
    .then(() => runCommand('npm', ['run', 'build']))
    .then(() => runCommand('mkdir -p dist && cp -r src dist/ && cp .npmignore LICENSE package.json README.md dist'))
    .then(() => runCommand('npm', ['publish', '--scope=@tailormap-viewer', '--registry=https://repo.b3p.nl/nexus/repository/npm-public'], path.resolve(__dirname, '../dist/')))
    .then(() => runCommand('git', ['add', '-A']))
    .then(() => {
        const currentVersion = require(path.resolve(__dirname, 'package.json')).version
        return runCommand('git', ['commit', '-m', `Released version ${currentVersion}`]);
    });
