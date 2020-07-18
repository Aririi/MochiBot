module.exports = {
	name: 'say',
	description: 'Echoes the provided message.',
	cooldown: 10,
	aliases: ['echo', 'print'],
	usage: ['message'],
	args: true,
	execute(message, args) {
		if (args[0] === undefined) {return message.channel.send(`${message.member.username}: Say wha?`);}
		else {
			let messageToSay = args.join(' ');
			messageToSay = messageToSay.slice(0, 2000);
			console.log(`SAY: ${message.author.tag} ${messageToSay}`);
			message.delete().catch(console.error);
			message.channel.send(messageToSay);
		}
	},
};
