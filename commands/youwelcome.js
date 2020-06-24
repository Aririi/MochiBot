module.exports = {
	name: 'welcome',
	description: 'Says you\'re welcome to a user.',
	cooldown: 5,
	aliases: ['yourewelcome', 'youwelcome'],
	execute(message) {
		if (!message.mentions.users.size) {
			return message.reply('you\'re welcome. :)');
		}

		const ywelcome = message.mentions.users.map(user => {
			return `${user.username}, you're welcome. :)`;
		});

		message.channel.send(ywelcome);
	},
};
