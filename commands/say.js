const { prefix } = require('../config.json');

module.exports = {
	name: 'say',
	description: 'Echoes the provided message.',
	cooldown: 10,
	aliases: ['echo', 'print'],
	usage: ['message'],
	execute(message) {
		// removes the prefix and command from the message
		const regex = new RegExp(`^${prefix}say|${prefix}print|${prefix}echo`, 'gi');
		const messageToSay = message.content.slice(0, 2000).replace(regex, '');
		console.log(message.author.tag, messageToSay);
		if (messageToSay == '') {
			return message.reply('say wha?');
		}
		else {
			// message.author.delete(1000).catch(console.log());
			message.channel.send(messageToSay);
		}
	},
};
