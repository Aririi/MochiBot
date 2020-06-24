module.exports = {
	name: 'kick',
	description: 'Kicks the mentioned user.',
	guildOnly: true,
	usage: '[mentioned user]',
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to kick them!');
		}
		const taggedUser = message.mentions.users.first();
		console.log(`${message.author} wanted to kick ${taggedUser}`);

		if (args[1] === undefined) {
			message.channel.send(`Kicking ${taggedUser.username} from the server. Whoosh.`);
		}
		else {
			args.shift();
			const reason = args.join(' ');
			message.channel.send(`Kicking ${taggedUser.username} for ${reason}.`);
		}
	},
};
