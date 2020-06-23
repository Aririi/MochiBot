module.exports = {
	name: 'thank',
	description: 'Thanks a user.',
	aliases: ['thanks'],
	cooldown: 5,
	usage: '[mentioned user]',
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you\'re welcome.');
		}


		const thank = message.mentions.users.map(user => {
			// checks if author mentioned themselves
			if (user.id == message.author.id) {
				return `*${user.username} pats themselves on the back.*`;
			}
			else {
				return `Thanks, <@${user.id}>!`;
			}
		});

		message.channel.send(thank);
	},
};
