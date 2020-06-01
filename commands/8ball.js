// Does random number gen, then matches result to a phrase
module.exports = {
	name: '8ball',
	description: 'Responds to a question.',
	cooldown: 5,
	aliases: ['magic-ball', 'fortune-teller', 'bowling-ball'],
	usage: '[question]',
	execute(message) {
		const questionMark = message.content.match(/[?]/);
		// regexs for ?
		const ballUser = message.author.username;
		// if sentence does notcontained regex'// DEBUG:  ?
		if (questionMark == null) {
			message.channel.send(`${ballUser}: I don't think that's a question.`);
		}
		// if so, run 2 randoms, and if they match, add or subtract them based on another random
		// made to increase randomness of 8ball due to frequent repeats in flps
		else if (questionMark == '?') {
			let eightBall = (Math.ceil(Math.random() * 6));
			const eightBall2 = (Math.ceil(Math.random() * 6));

			let randomChoice = (Math.ceil(Math.random() * 2));
			if (randomChoice == 1) {
				randomChoice = '+';
			}
			if (randomChoice != 1) {
				randomChoice = '-';
			}

			console.log(eightBall, eightBall2, randomChoice);

			if (eightBall == eightBall2) {
				// puts all args together if random #s were repeated
				eightBall = eightBall | randomChoice | 1;
				console.log(`Result: ${eightBall}`);
			}
			if (eightBall == 0) {
				message.channel.send(`${ballUser}: Looks like a 50-50.`);
			}
			if (eightBall == 1) {
				message.channel.send(`${ballUser}: Signs point to yes.`);
			}
			if (eightBall == 2) {
				message.channel.send(`${ballUser}: Without a doubt.`);
			}
			if (eightBall == 3) {
				message.channel.send(`${ballUser}: Reply hazy, try again...`);
			}
			if (eightBall == 4) {
				message.channel.send(`${ballUser}: My reply is no.`);
			}
			if (eightBall == 5) {
				message.channel.send(`${ballUser}: Outlook not so good.`);
			}
			if (eightBall == 6) {
				message.channel.send(`${ballUser}: [ The bowling ball doesn't answer. ]`);
			}
			if (eightBall == 7) {
				message.channel.send(`${ballUser}: Perhaps...`);
			}
		}
	},
};
