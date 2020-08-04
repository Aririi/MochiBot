// randomly sets status based on RNG
module.exports = {
	name: 'randomstatus',
	execute(client) {
		function randomStatus() {
			const randomNumberResult = (Math.floor(Math.random() * 6));
			const readyUserActivity = [
				['PLAYING', 'with bits and bytes.'],
				['PLAYING', 'with code blocks.'],
				['PLAYING', 'red pill or blue pill?'],
				['PLAYING', 'Materialization Shiritori.'],
				['WATCHING', 'out for the Unseen Horizon.'],
				['LISTENING', 'the awakening of the Dark Flame Master.'],
			];
			client.user.setActivity(readyUserActivity[randomNumberResult][1], { type: readyUserActivity[randomNumberResult][0] })
				.then(console.log(`The status has been changed to '${readyUserActivity[randomNumberResult][0]} ${readyUserActivity[randomNumberResult][1]}'`))
				.catch(console.error);
		}
		randomStatus();
	},
};
