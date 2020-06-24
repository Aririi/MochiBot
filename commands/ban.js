module.exports = {
	name: 'ban',
	description: 'Bans the mentioned user.',
	guildOnly: true,
	usage: '[mentioned user]',
	execute(message, args) {
		if (!message.mentions.users.size) {
			return message.reply('you need to tag a user in order to ban them!');
		}
		const taggedUser = message.mentions.users.first();
		console.log(`${message.author} wanted to ban ${taggedUser}`);

		if (args[1] === undefined) {
			message.channel.send(`Banning ${taggedUser.tag} from the server. Whoosh.`);
		}
		else {
			args.shift();
			const reason = args.join(' ');
			message.channel.send(`Banning ${taggedUser.tag} for ${reason}`);
		}
	},
};
