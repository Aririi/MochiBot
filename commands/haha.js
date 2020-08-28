const { name } = require('../config.json');

module.exports = {
	name: 'haha',
	description: `Funny! (Mention a user or have ${name} laugh with you.)`,
	cooldown: 5,
	aliases: ['funny'],
	execute(message, args) {
		if (args[0] === undefined) {return message.channel.send(`${message.author.username}: Lol indeed.`);}
		else {message.channel.send(`That's really funny, ${args.join(' ')}`);}
	},
};
