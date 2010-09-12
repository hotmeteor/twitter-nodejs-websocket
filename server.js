var sys    = require('sys'),
	TwitterNode = require('twitter-node').TwitterNode;

// Command line args
var USERNAME = process.ARGV[2];
var PASSWORD = process.ARGV[3];
var KEYWORD  = process.ARGV[4] || "iphone";

if (!USERNAME || !PASSWORD)
  return sys.puts("Usage: node server.js <twitter_username> <twitter_password> <keyword>");


var twit = new TwitterNode({
  user: USERNAME, 
  password:  PASSWORD,
});


twit.track(KEYWORD)

twit
  .addListener('tweet', function(tweet) {
    sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
  })

  .addListener('limit', function(limit) {
    sys.puts("LIMIT: " + sys.inspect(limit));
  })

  .addListener('delete', function(del) {
    sys.puts("DELETE: " + sys.inspect(del));
  })

  .addListener('end', function(resp) {
    sys.puts("wave goodbye... " + resp.statusCode);
  })
  .stream();