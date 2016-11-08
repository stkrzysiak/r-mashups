"use strict";
const reddit = require('redwrap');
const ytdl = require('youtube-dl');
const chalk = require('chalk');
const fs = require('fs');
const shell = require('shelljs');
const userHome = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const musicDir = `${userHome}/Music/`;
const subreddit = process.argv[2];
const targetDir = musicDir + subreddit;
const history = [];
let counter = 0;

console.log(`targetDir: ${targetDir} \n musicDir: ${musicDir}`);
shell.mkdir(targetDir);

reddit.r(`${subreddit}/top`).from('all').sort('top').limit(100).exe(function(err, data, res){
  for (let post of data.data.children) {
    counter++;
   console.log(chalk.blue(`#${counter} ${post.data.title} ${post.data.domain}`));
    if(post.data.domain === 'youtube.com') {
      console.log(`Fixing to DL ${post.data.title} ${post.data.domain}`);
      ytdl.exec(post.data.url, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
        if (err) {
          history[post.data.url] = {[post.data.title]: false};
          console.log(chalk.red(err));
        } else {
          console.log(chalk.green(output.join('\n')));
          history[post.data.url] = {[post.data.title]: true};
          shell.mv('*.mp3', targetDir);
        }
      });
   }
}

writeHistory(targetDir, history);

});



const moveFiles = (targetDir) => {
  console.log(chalk.green.bold(`Moving the downloaded files to ${targetDir}`));
  const exec = require('child_process').exec;
  const currentDirectory = process.cwd();
  const cmd = `mv ${currentDirectory}/*.mp3 ${targetDir}`;
  console.log(chalk.green.bold(`Executing command: ${cmd}`));
  exec(cmd, function(error, stdout, stderr) {
    console.log(stdout);
    console.log(stderror);
    console.log(error);
  });
}

const writeHistory = (targetDir, history) => {
  fs.writeFile(`${targetDir}/history.json` , JSON.stringify(history), function (err) {
    if (err) return console.log(chalk.red.bold(err));
  });
}
