const { prefix } = require('../config.json');

module.exports = {
	name: 'setstatus',
	description: 'Provide type and addendum to set bot status (devOnly).',
	aliases: ['setpresence', 'set-status', 'set-presence', 'setactivity', 'set-activity'],
	usage: '[LISTENING/WATCHING/PLAYING/STREAMING] [text]',
	devOnly: true,
	execute(message, args, client) {
		const type = args[0].toUpperCase();
		args.shift();
		const text = args.join(' ');
		// removes command from message
		if (args[0] == undefined) {
			return message.reply(
				`insufficient arguments.\n
				Usage: ${module.exports.usage} (note: LISTENING type contains 'to')\n
				Example: \`${prefix}setstatus LISTENING Beethoven's Fifth Symphony\`\n
				Result: "Listening to Beethoven's Fifth Symphony"`
			);
		}
		console.log(`Changed status with: type ${type} and text "${text}"`);
		client.user.setActivity(text, { type: type })
			.then(message.channel.send(`Status changed with type '${type}' and text '${text}'`))
			.catch(console.error);
	},
};
