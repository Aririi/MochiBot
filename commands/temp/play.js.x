module.exports = {
	name: 'play',
	description: 'Plays music from a known file or URL. [WIP>',
	aliases: ['p'],
	guildOnly: true,
	usage: '<URL/file name>',
	execute(message, args, client) {

		client.on('message', async message => {
			// Join the same voice channel of the author of the message
			if (message.member.voice.channel) {

				const connection = await message.member.voice.channel.join();

				// const connection = message.member.voice.channel.join();

				const dispatcher = connection.play(args);
				if (message.includes('disconnect')) {
					dispatcher.destoy();
				}
				dispatcher.on('start', () => {
					console.log('audio.mp3 is now playing!');
				});

				dispatcher.on('finish', () => {
					console.log('audio.mp3 has finished playing!');
				});

				// Always remember to handle errors appropriately!
				dispatcher.on('error', console.error);

			}

		});

	} };
