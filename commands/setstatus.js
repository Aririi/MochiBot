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
		// const regex1 = new RegExp(`^(
		// 	${prefix}${module.exports.aliases[0]}|
		// 	${prefix}${module.exports.aliases[1]}|
		// 	${prefix}${module.exports.aliases[2]}|
		// 	${prefix}${module.exports.aliases[3]}|
		// 	${prefix}${module.exports.aliases[4]}|
		// 	${prefix}${module.exports.aliases[5]}|
		// 	${prefix}${module.exports.name})`, 'gi');
		// const text1 = message.content.replace(regex1, '');
		if (args[0] == undefined) {
			return message.reply(`insufficient arguments.\nUsage: ${module.exports.usage} (note: LISTENING type contains 'to')\nExample: \`${prefix}setstatus LISTENING Beethoven's Fifth Symphony\`\nResult: "Listening to Beethoven's Fifth Symphony"`);
		}
		// // removes first argument
		// const regex2 = new RegExp(`^(${args[0]})`, 'gi');
		// const text2 = text1.replace(regex2, '');
		// const text3 = text2.trim();
		console.log(`Changed status with: type ${type} and text "${text}"`);
		client.user.setActivity(text, { type: type })
			.then(message.channel.send(`Status changed with type '${type}' and text '${text}'`))
			.catch(console.error);
	},
};
