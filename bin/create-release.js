const path = require('path');
const { runCommand, checkCleanGitRepo } = require("./shared");

checkCleanGitRepo();

runCommand('npm', ['version', 'patch', '--git-tag-version=false'])
    .then(() => runCommand('npm', ['run', 'build']))
    .then(() => runCommand('mkdir', ['-p', 'dist' ]))
    .then(() => runCommand('cp', ['-r', 'src', 'dist/']))
    .then(() => runCommand('cp', ['.npmignore', 'LICENSE', 'package.json', 'README.md', 'dist']))
    .then(() => runCommand('npm', ['publish', '--scope=@tailormap-viewer', '--registry=https://repo.b3p.nl/nexus/repository/npm-public'], path.resolve(__dirname, '../dist/')))
    .then(() => runCommand('git', ['add', '-A']))
    .then(() => {
        const currentVersion = require(path.resolve(__dirname, '../package.json')).version
        return runCommand('git', ['commit', '-m', `Released version ${currentVersion}`]);
    });
