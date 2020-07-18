const { owner } = require('../config.json');

module.exports = {
	name: 'darnyou',
	description: 'Heckin bot.',
	cooldown: 5,
	aliases: ['heckyou', 'kys'],
	execute(message) {
		if (message.author.id == owner) {
			message.channel.send('I\'m sorry to have disappointed you, creator...');
		}
		else {message.channel.send('Sorry to disappoint. (っ- ‸ – ς)');}
	},
};
