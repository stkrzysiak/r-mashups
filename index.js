"use strict";
const reddit = require('redwrap');
const ytdl = require('youtube-dl');

reddit.r('mashups').top().limit(30).exe(function(err, data, res){
  for (let post of data.data.children) {
   console.log(post.data.domain);
    if(post.data.domain === 'soundcloud.com') {
      ytdl.exec(post.data.url, ['-x', '--audio-format', 'mp3'], {}, function(err, output) {
        if (err) throw err;
        console.log(output.join('\n'));
      });
   }
}

});
