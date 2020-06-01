module.exports = {
	name: 'beep',
	description: 'Boop!',
	cooldown: 5,
	execute(message) {
		message.channel.send('Boop.');
	},
};
