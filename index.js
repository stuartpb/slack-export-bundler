var fs = require("fs");
var path = require("path");

var base = process.argv[2] || process.env.BASE_DIR;
var indent = process.env.INDENT || 0;

function jsonFile(name) {
  return JSON.parse(fs.readFileSync(path.join(base, name),'utf8'));
}

var users = jsonFile('users.json');
var channels = jsonFile('channels.json');

for (var i = 0; i < channels.length; i++) {
  var channelName = channels[i].name;
  var dayFiles = fs.readdirSync(path.join(base, channelName));
  var days = [];
  for (var j = 0; j < dayFiles.length; j++) {
    var dayFilename = dayFiles[j];
    var messages = jsonFile(path.join(channelName,dayFilename));
    days[j] = {
      // date is the filename minus '.json'
      date: dayFilename.slice(0,-5),
      messages: messages
    };
  }
  channels[i].days = days;
}

fs.writeFileSync(base+'.json',JSON.stringify({
  users: users,
  channels: channels
}, null, indent), 'utf8');
