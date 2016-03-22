var moment = require('moment');
var now = moment();

//console.log(now.format());
//console.log(now.format('MMM Do YYYY, h:mm a'));

var timestamp = now.valueOf();
console.log(timestamp);
var timestampMoment = moment.utc(timestamp);
console.log(timestampMoment.local().format());
console.log(timestampMoment.format('hh:mm a'));
