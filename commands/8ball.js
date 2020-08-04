module.exports = {
	name: '8ball',
	description: 'Responds to a question with a certain response.',
	aliases: ['eightball', 'magicball', 'fortuneteller', 'bowlingball'],
	usage: '<question>',
	args: true,
	execute(message) {
		const ballUser = message.author.username;
		const responses = [
			'It is certain.',
			'It is decidedly so.',
			'Without a doubt.',
			'Yes – definitely.',
			'You may rely on it.',
			'As I see it, yes.',
			'Outlook good.',
			'Perhaps...',
			'Signs point to yes.',
			'Reply hazy, try again...',
			'Ask again later.',
			'Looks like a 50-50.',
			'Better not tell you now.',
			'Cannot predict now.',
			'Await and see... Or ask once more.',
			'Concentrate and ask again.',
			'[ The bowling ball doesn\'t answer. ]',
			'Don\'t count on it.',
			'My reply is no.',
			'My sources say no.',
			'Outlook not so good.',
		];

		if (!message.content.includes('?')) {return message.channel.send(`${ballUser}: I don't think that's a question.`);}
		else {
			let eightBall = (Math.floor(Math.random() * responses.length));
			let randomChoice = (Math.floor(Math.random() * 2));
			switch (randomChoice) {
			case 0: randomChoice = '+'; break;
			case 1: randomChoice = '-'; break;
			}
			// if the two RNGs match, add/subtract them, for volatility
			if (eightBall === Math.floor(Math.random() * responses.length) && (eightBall != 8 || eightBall != 0)) {eightBall = eightBall | randomChoice | 1;}

			message.channel.send(`${ballUser}: ${responses[eightBall]}`);
		}
	},
};
