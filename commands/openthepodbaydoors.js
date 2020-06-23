module.exports = {
	name: 'openthepodbaydoors',
	description: 'HAL 5000 returns.',
	cooldown: 5,
	aliases: ['open-the-pod-bay-doors', 'openthepodbaydoor', 'open-the-pod-bay-door'],
	execute(message) {
		message.channel.send('*I\'m afraid I can\'t do that.*');
	},
};
