module.exports = {
	name: '8ball',
	description: 'Responds to a question with a certain response.',
	aliases: ['magic-ball', 'fortune-teller', 'bowling-ball'],
	usage: '[question]',
	args: true,
	execute(message) {
		// checks if has '?'
		const questionMark = message.content.match(/[?]/);
		const ballUser = message.author.username;
		if (questionMark == null) {
			message.channel.send(`${ballUser}: I don't think that's a question.`);
		}
		// if is question, do 2 RNGs
		// made to increase randomness of 8ball due to frequent repeats in flps
		else if (questionMark == '?') {
			let eightBall = (Math.ceil(Math.random() * 6));
			const eightBall2 = (Math.ceil(Math.random() * 6));
			let randomChoice = (Math.ceil(Math.random() * 2));
			if (randomChoice == 1) {randomChoice = '+';}
			if (randomChoice != 1) {randomChoice = '-';}
			// console.log(eightBall, eightBall2, randomChoice);
			// if they match, add/subtract them, for volatility
			if (eightBall == eightBall2) {eightBall = eightBall | randomChoice | 1;}
			const responses = [
				`${ballUser}: Looks like a 50-50.`,
				`${ballUser}: Signs point to yes.`,
				`${ballUser}: Without a doubt.`,
				`${ballUser}: Reply hazy, try again...`,
				`${ballUser}: My reply is no.`,
				`${ballUser}: Outlook not so good.`,
				`${ballUser}: [ The bowling ball doesn't answer. ]`,
				`${ballUser}: Perhaps...`,
			];
			message.channel.send(responses[eightBall]);
		}
	},
};
