const fs = require('fs');

module.exports = {
	name: 'log',
	description: 'Logs the input.',
	aliases: ['save', 'remember'],
	execute(message, args) {
		fs.writeFileSync('./log/log1.txt', args);
		message.channel.send(`Logged the following: ${args}`);
	} };
