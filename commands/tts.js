// tts command for the vc, primarily if a user doesnt have a mic

module.exports = {
	name: 'tts',
	description: 'Converts the text into voice for the connected voice channel.',
	cooldown: 4,
	guildOnly: true,
	usage: '[message]',
	execute(message) {
		message.channel.send('This command is not yet functional.');
	},
};
