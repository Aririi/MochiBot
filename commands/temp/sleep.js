const { token } = require('../config.json');

module.exports = {
	name: 'sleep',
	description: 'Test command for reinit.',
	cooldown: 60,
	alias: ['restart', 'shutdown'],
	execute(message) {
		// Turn bot off (destroy), then turn it back on
		function sleep(channel) {
			// send channel a message that you're resetting bot [optional]
			channel.message.send('Resetting...')
				.then(message => client.destroy())
				.then(() => client.login(token));
		}
	},
};
