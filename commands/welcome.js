module.exports = {
	name: 'welcome',
	description: 'Says you\'re welcome to a user.',
	aliases: ['yourewelcome', 'youwelcome'],
	execute(message) {
		if (!message.mentions.users.size) {return message.channel.send(`${message.author.username}, you're welcome.`);}
		const welcome = message.mentions.users.map(user => {return `You're welcome, ${user.username}.`;});
		message.channel.send(welcome);
	},
};
