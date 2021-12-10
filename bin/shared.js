const { spawn, execSync } = require('child_process');
const path = require('path');

const checkCleanGitRepo = () => {
    const gitStatus = execSync('git status --short').toString();
    const gitDirty = gitStatus !== '';
    if (gitDirty) {
        console.error('Git repository is dirty, please commit first before making a new release');
        process.exit();
    }
};

const runCommand = (command, args, cwd) => {
    return new Promise((resolve, reject) => {
        const cmd = spawn(command, args, {
            stdio: 'inherit',
            env: process.env,
            cwd: cwd || path.resolve(__dirname, '../')
        });
        cmd.on('error', err => {
            console.error(err);
            reject();
        });
        cmd.on('close', (code) => {
            resolve();
        });
    });
};

exports.checkCleanGitRepo = checkCleanGitRepo;
exports.runCommand = runCommand;
