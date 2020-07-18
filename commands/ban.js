module.exports = {
	name: 'ban',
	description: 'Bans the mentioned user.',
	guildOnly: true,
	usage: '[mentioned user]',
	args: true,
	execute(message, args) {
		const taggedUser = message.mentions.users.first();
		console.log(`${message.author} wanted to ban ${taggedUser}`);

		if (args[1] === undefined) {message.channel.send(`Banning ${taggedUser.tag} from the server. Whoosh.`);}
		else {
			args.shift();
			const reason = args.join(' ');
			message.channel.send(`Banning ${taggedUser.tag} for ${reason}`);
		}
	},
};
