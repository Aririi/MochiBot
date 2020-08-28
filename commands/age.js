const moment = require('moment');
// code directly from https://github.com/hugonun/discordid2date/blob/master/main.js
module.exports = {
	name: 'age',
	description: 'Gets the creation date of the provided ID.',
	aliases: ['creationdate'],
	usage: '<id>',
	args: true,
	execute(message, args) {
		let hour24; let hour12; let age;
		function convertIDtoUnix(id) {
			/* Note: id has to be str */
			const bin = (+id).toString(2);
			let unixbin = '';
			let unix = '';
			const m = 64 - bin.length;
			unixbin = bin.substring(0, 42 - m);
			unix = parseInt(unixbin, 2) + 1420070400000;
			return unix;
		}

		function convert(id) {
			const unix = convertIDtoUnix(id.toString());
			const timestamp = moment.unix(unix / 1000);
			hour24 = timestamp.format('YYYY-MM-DD, HH:mm:ss'); hour12 = timestamp.format('YYYY-MM-DD, h:mm:ss A'); age = timestamp.fromNow();
			message.channel.send(`**${message.author.username}**, here's when account \`${id}\` was created:\n__24 hour time:__ ${hour24}\n__12 hour time:__ ${hour12}\n__UNIX Timestamp:__ ${unix} (About ${age}.)`);
		}
		convert(args[0]);
	},
};
