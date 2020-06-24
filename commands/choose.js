module.exports = {
	name: 'choose',
	description: 'Chooses between two choices using RNG.',
	aliases: ['pick'],
	usage: '[option one] or [option two]',
	execute(message, args) {
		// splits the message into two phrases where the word 'or' exists
		const joinedArgs = args.join();
		const regex = new RegExp(',', 'gi');
		const formattedArgs1 = joinedArgs.replace(regex, ' ');
		const formattedArgs2 = formattedArgs1.replace('?', '');
		const choice = formattedArgs2.split(' or ', 2);
		// console.log(choices);
		// picks a random number to select from the array of two choices
		const choiceNumber = Math.floor(Math.random() * 2);
		// console.log(choiceNumber);
		const chosen = choice[choiceNumber];
		console.log(`Chose "${chosen}"`);
		// selects the other choice and stores it for the sentence structures that will use it (further below)
		let otherChoiceNumber = null;
		if (choiceNumber === 1) {
			otherChoiceNumber = 0;
		}
		else if (choiceNumber === 0) {
			otherChoiceNumber = 1;
		}
		const otherChoice = choice[otherChoiceNumber];
		console.log(otherChoice);

		// an array of possible sentence replies
		const choicePhrases = [
			'Why would you do that when you could do something else instead?',
			`"${chosen}" doesn't really seem like a good idea right now.`,
			'No, maybe tomorrow.',
			'Are you sure? Well alright.',
			'Oh yes, definitely!',
			'Hm. I can\'t choose. Ask me again in a couple of minutes.',
			`I don't think I've heard of "${chosen}", so probably not.`,
			'Yes! Do it now!',
			'Hm, yeah okay.',
			'Ah... well, I\'d say wait an hour.',
			'Oh, I\'ve heard about that. You\'ll want to wait until tomorrow.',
			'Boo! No!',
			`I'd advice against "${chosen}" right now.`,
			`Some ""${chosen}"" sounds nice`,
			`I'm 40% "${chosen}"!`,
			`You *could* do "${chosen}", I guess.`,
			`Why not both? Okay fine. "${chosen}".`,
			`I sense some "${chosen}" in your future!`,
			` "${chosen}" is for cool kids!`,
			`Definitely "${chosen}"... Or maybe ${otherChoice}...`,
			`If I had a gold nugget for every time someone asked me about "${chosen}"`,
			`The proof is in the pudding. Definitely "${chosen}". Now please get it out of my pudding.`,
			`I received a message from future you, said to go with "${chosen}".`,
			`I saw that "${chosen}" is the best choice in a vision`,
			`You'll want to go with "${chosen}".`,
			`Elementary dear Watson, "${chosen}" is the obvious choice!`,
			`My grandfather always told me that "${chosen}" is the way to go!`,
			`If I've learned anything in life it's that you always pick "${chosen}"`,
			`Once you get a taste of "${chosen}" you can't stop.`,
			`One the one hand, there's "${chosen}" but then there's also ${otherChoice}`,
			`Somebody once told me to roll with "${chosen}"`,
			`Out of these {raw_count} choices? I'd say "${chosen}".`,
			`I've heard "${chosen}" is in these days`,
			`I spy with my robotic eye something beginning with "${chosen}"!`,
			`Haven't you always gone with "${chosen}"? Hm, maybe not.`,
			`I have a pamphlet that says never to engage in "${chosen}", so you should definitely do it!`,
			`Pretty sure I'd want you to go with "${chosen}"!`,
			`The sands of time whisper to me... they're saying "${chosen}".`,
			`I tried reading my tea leaves this morning. There was sometihng about death and doom. Anyway, go with "${chosen}"`,
			`Eeny, meeny, miny, "${chosen}".`,
			` "${chosen}"'os, for a complete breakfast!`,
			` "${chosen}", now with 30% fewer deaths caused by negligence!`,
			`Hold on tightly! "${chosen}" is a wild ride!`,
			`A wizard is never late, and sometimes engages in some "${chosen}".`,
			`I received a telegram from a long lost relative that only read "${chosen}". Weird.`,
			`Wait, what was the question again? Uhh... "${chosen}"?`,
			`I want a divorce. I'm taking half the "${chosen}".`,
			`Is it a bird?! Is it a plane?! No! It's "${chosen}"!`,
		];

		// picks from one of the above phrases using more RNG
		const chosenPhraseNumber = Math.floor(Math.random() * 47);
		const chosenPhrase = choicePhrases[chosenPhraseNumber];
		console.log(chosenPhrase);

		message.channel.send(`${message.author.username}: ${chosenPhrase}`);
	},
};
