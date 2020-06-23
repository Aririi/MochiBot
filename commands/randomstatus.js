module.exports = {
	name: 'randomstatus',
	description: 'Randomly shuffles the status from an array based off of RNG.',
	cooldown: 30,
	aliases: ['shufflestatus'],
	execute(message, args, client) {
		const randomNumberResult = (Math.floor(Math.random() * 6));
		const readyUserActivity = [
			['PLAYING', 'with bits and bytes.'],
			['PLAYING', 'with code blocks.'],
			['PLAYING', 'red pill or blue pill?'],
			['PLAYING', 'Materialization Shiritori.'],
			['WATCHING', 'out for the Unseen Horizon.'],
			['LISTENING', 'the awakening of the Dark Flame Master.'],
		];
		// client.user.setActivity(readyUserActivity[randomNumberResult[1]], { type: readyUserActivity[randomNumberResult[0]] })
		// 	.then(message.channel.send('Status has been shuffled.'))
		// 	.catch(console.error);
		function successCallback() {
			console.log(`The status has been changed to '${readyUserActivity[randomNumberResult][0]} ${readyUserActivity[randomNumberResult][1]}'`);
			message.channel.send('The status has been shuffled.').catch(console.error);
		}
		client.user.setActivity(readyUserActivity[randomNumberResult][1], { type: readyUserActivity[randomNumberResult][0] })
			.then(successCallback())
			.catch(console.error);
	} };
