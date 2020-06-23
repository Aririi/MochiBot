module.exports = {
	name: 'haha',
	description: 'Funny! (Mention a user or have MochiBot laugh with you.)',
	cooldown: 5,
	aliases: ['funny'],
	execute(message) {
		// similar to avatar, one command for none mentioned, etc
		if (!message.mentions.users.size) {
			if (message.channel.type === 'dm') {
				return message.channel.send('Lol indeed.');
			}
			else {
				return message.channel.send(`${message.author.username}: Lol indeed.`);
			}
		}

		const haha = message.mentions.users.map(user => {
			return `That's funny, <@${user.id}>.`;
		});

		message.channel.send(haha);
	},
};
