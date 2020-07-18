module.exports = {
	name: 'openthepodbaydoors',
	description: 'HAL 9000 returns.',
	aliases: ['openthepodbaydoor'],
	execute(message) {
		message.channel.send('*I\'m afraid I can\'t do that.*');
	},
};
