module.exports = {
	name: 'args-info',
	description: 'Information about the arguments provided.',
	args: true,
	usage: '[arg]',
	aliases: ['argsinfo', 'argcheck,', 'arg-check'],
	execute(message, args) {
		// args is an array passed by index.js
		if (args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
	},
};
