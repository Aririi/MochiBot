module.exports = {
	name: 'moo',
	description: 'Moon? Mooon.',
	aliases: ['cow', 'cowspeak'],
	usage: '<sentence>',
	args: false,
	execute(message, args) {
		if (args[0] === undefined) {return message.channel.send('Moo?');}
		let text = args.join(' ');
		text = text.replace(/o/g, 'oo'); text = text.replace(/u/g, 'oo');
		text = text.replace(/O/g, 'OO'); text = text.replace(/U/g, 'UU');
		message.channel.send(text);
	},
};
