module.exports = {
	name: 'kick',
	description: 'Kicks the mentioned user.',
	guildOnly: true,
	usage: '<mention>',
	args: true,
	execute(message, args) {
		const taggedUser = message.mentions.users.first();
		console.log(`${message.author} wanted to kick ${taggedUser}`);
		if (args[1] === undefined) {message.channel.send(`Kicking ${taggedUser.username} from the server. Whoosh.`);}
		else {args.shift(); message.channel.send(`Kicking ${taggedUser.username} for ${args.join(' ').replace('for', '')}.`);}
	},
};
