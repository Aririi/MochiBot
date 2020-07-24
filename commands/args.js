module.exports = {
	name: 'argsinfo',
	description: 'Information about the arguments provided.',
	usage: '[args]',
	aliases: ['args'],
	args: true,
	execute(message, args) {
		if (args[0] === 'foo') {return message.channel.send('bar');}
		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};
