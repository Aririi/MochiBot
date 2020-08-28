module.exports = {
	name: 'choose',
	description: 'Chooses between choices using RNG.',
	aliases: ['pick'],
	usage: '<option> (opt: or <option 2> or <option 3>)',
	args: true,
	execute(message, args) {
		let choices; let chosen; let otherChoice;
		let chosenPhraseNumber; let chosenPhrase;
		// splits the message into seperate phrases where 'or' exists
		if (args.length > 1) {
			const joinedArgs = args.join(' ');
			choices = joinedArgs.replace('?', '');
			choices = choices.split(/, or |, | or /gi);
			// picks a random number to select from the array of choices
			const choiceNumber = Math.floor(Math.random() * choices.length);
			chosen = choices[choiceNumber];
			// selects another choice and stores it for the sentence structures that will use it (further below)
			let otherChoiceNumber = Math.floor(Math.random() * choices.length);
			while (otherChoiceNumber === choiceNumber) {otherChoiceNumber = Math.floor(Math.random() * choices.length);}
			otherChoice = choices[otherChoiceNumber];
		}
		else {
			const choiceResponses1 = [
				'No, maybe tomorrow.',
				'Are you sure? Well alright.',
				'Oh yes, definitely!',
				'Ah... well, I\'d say wait an hour.',
				'Oh, I\'ve heard about that. You\'ll want to wait until tomorrow.',
				'Boo! No!',
				'Why would you do that when you could do something else instead?',
				'Yes! Do it now!',
				'Hm, yeah okay.',
				'Hm. I can\'t choose. Ask me again in a couple of minutes.',
			];
			chosenPhraseNumber = Math.floor(Math.random() * choiceResponses1.length);
			chosenPhrase = choiceResponses1[chosenPhraseNumber];
			return message.channel.send(`${message.author.username}: ${chosenPhrase}`);
		}

		const choiceResponses2 = [
			'Why would you do either of those when you could do something else instead?',
			`Why not both? — Okay, fine: "${chosen}".`,
			`Out of these two choices? I'd say ${chosen}.`,
		];
		const choiceResponses = [
			'Why would you do any of those when you could do something else instead?',
			`"${chosen}" doesn't really seem like a good idea right now.`,
			'Hm. I can\'t choose. Ask me again in a couple of minutes.',
			`I don't think I've heard of "${chosen}", so probably not.`,
			`I'd advise against "${chosen}" right now.`,
			`Some "${chosen}" sounds nice.`,
			`I'm 40% for ${chosen}!`,
			`You *could* do "${chosen}", I guess.`,
			`I sense some "${chosen}" in your future!`,
			`"${chosen}" is for cool kids!`,
			`Definitely ${chosen}... Or maybe ${otherChoice}...`,
			`If I had a gold nugget for every time someone asked me about "${chosen}," I'd had a have a lot of them.`,
			`The proof is in the pudding — definitely ${chosen}. Now please, get it out of my pudding.`,
			`I received a message from future you, who said to go with ${chosen}.`,
			`I saw that "${chosen}" is the best choice in a vision.`,
			`You'll want to go with ${chosen}.`,
			`It's elementary my dear Watson, "${chosen}" is the obvious choice! Quite a simple deduction, try to keep up.`,
			`My grandfather always told me that "${chosen}" is the way to go!`,
			`If I've learned anything in life it's that you always pick "${chosen}."`,
			`Once you get a taste of "${chosen}" you can't stop.`,
			`One the one hand, there's "${chosen}" but then there's also ${otherChoice}.`,
			`Somebody once told me to roll with "${chosen}."`,
			`I heard "${chosen}" is in these days.`,
			`I spy with my robotic eye something beginning with "${chosen}"!`,
			`Haven't you always gone with "${chosen}"? Hmm, maybe not.`,
			`I have a pamphlet that says never to engage in "${chosen}", so you should definitely do it!`,
			`Pretty sure I'd want you to go with "${chosen}"!`,
			`The sands of time whisper to me... they're saying "${chosen}."`,
			`I tried reading my tea leaves this morning. There was something about death and doom. Anyways, go with "${chosen}."`,
			`Eeny, meeny, miny, ${chosen}.`,
			`${chosen}'os, the best choice for a complete breakfast!`,
			`Try "${chosen}," now with 30% fewer deaths caused by negligence!`,
			`Hold on tightly! "${chosen}" is a wild ride!`,
			`A wizard is never late, and sometimes engages in some ${chosen}.`,
			`I received a telegram from a long lost relative that just reads "${chosen}". Weird.`,
			`Wait, what was the question again? Uhh... "${chosen}"?`,
			`I want a divorce. I'm taking half the "${chosen}".`,
			`Is it a bird?! Is it a plane?! No, it's "${chosen}"!`,
		];

		// picks from one of the above phrases using more RNG, based on # of choices
		if (choices.length === 2) {
			choiceResponses2.forEach(response => {choiceResponses.push(response);});
			chosenPhraseNumber = Math.floor(Math.random() * choiceResponses.length);
			chosenPhrase = choiceResponses[chosenPhraseNumber];
		}
		else if (choices.length > 2) {
			chosenPhraseNumber = Math.floor(Math.random() * choiceResponses.length);
			chosenPhrase = choiceResponses[chosenPhraseNumber];
		}
		message.channel.send(`${message.author.username}: ${chosenPhrase}`);
	},
};
