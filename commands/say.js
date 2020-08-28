module.exports = {
	name: 'say',
	description: 'Echoes the provided message.',
	cooldown: 10,
	aliases: ['echo', 'print'],
	usage: ['message'],
	execute(message, args) {
		if (args[0] === undefined) {return message.channel.send(`${message.member.username}: Say wha?`);}
		let messageToSay = args.join(' ');
		messageToSay = messageToSay.slice(0, (2000 - (message.author.tag.length + 3)));
		message.delete().catch(error => console.error()); message.channel.send(messageToSay).catch(error => console.error());;
	},
};
