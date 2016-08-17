"use strict";
const reddit = require('redwrap');
const ytdl = require('youtube-dl');
const chalk = require('chalk');
let counter = 0;

reddit.r('mashups/top').from('all').sort('top').limit(100).exe(function(err, data, res){
  for (let post of data.data.children) {
    counter++;
   console.log(chalk.blue(`#${counter} ${post.data.title} ${post.data.domain}`));
    if(post.data.domain === 'youtube.com') {
      console.log(`Fixing to DL ${post.data.title} ${post.data.domain}`);
      ytdl.exec(post.data.url, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
        if (err) {
          console.log(chalk.red(err));
        } else {
          console.log(chalk.green(output.join('\n')));
        }
      });
   }
}

});
