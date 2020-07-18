const { prefix } = require('../config.json');
// Does random number gen, multiplies by dice type, then rounds to get result
module.exports = {
	name: 'roll',
	description: 'Rolls die with given amount of dice and given number of sides.',
	cooldown: 1.5,
	aliases: ['dice'],
	usage: '[amount][type]',
	args: true,
	execute(message, args) {
		// splits first arg into amount and type
		const rollArgs = args[0].split(/[d-]/, 2);
		const amount = rollArgs[0];
		const type = rollArgs[1];
		// console.log('Roll:', rollArgs, amount, type);
		if (args[0] === undefined) {return message.send(`${message.author.username}: What amount/type of dice?.\n(Format: [amount][diceType])\nExample: \`${prefix}roll 2d8\``);}
		if (isNaN(amount)) {return message.send(`${message.author.username}: Invalid amount.\n\`(Format: [amount][diceType])\`\nExample: \`${prefix}roll 2d8\``);}
		if (isNaN(type)) {return message.send(`${message.author.username}: Invalid type.\n\`(Format: [amount][diceType])\`\nExample types: d2,d4,d7,d10\nExample: \`${prefix}roll 2d8\``);}
		if (type == 0) {return message.send(`${message.author.username}: Error: Zero-sided die don't exist yet.`);}
		if (amount == 1) {return message.channel.send(`One d${type} rolled a ${Math.ceil(Math.random() * type)}.`);}
		if (type < 1 || type > 100) {return message.channel.send(`${message.author.username}: Type of dice is limited from 1 to 100.\n(Format: [amount][diceType])\nExample: \`${prefix}roll 2d8\``);}
		if (amount <= 1 || amount > 100) {return message.reply(`amount of dice needs to be 1-100.\n(Format: [amount][diceType])\nExample: \`${prefix}roll 2d8\``);}
		else {
			// initial declare of result for the loop
			let results = [];
			// for loop for RNG as amount needs, putting it into an array
			for (let i = amount; i > 0; i--) {
				results[i - 1] = Math.ceil(Math.random() * type);
				// console.log(`Rolling: ${results}`);
			}
			const rolledDice = results;
			results = results.join(', ');
			// first part of text to send, before results changes back to an array
			let rollResult = `Rolled: [${results}] => `;
			results = results.split(', ');
			// loops the result array, adding it to itself
			for (let i = rolledDice.length - 2; i >= 0; i--) {
				// pops a number from the array and adds it to the first element
				if (results[1] != undefined) {rolledDice[0] = Number(rolledDice.pop()) + Number(rolledDice[0]);}
				// console.log(`Summing: ${rolledDice[0]}`);
			}
			console.log(results);
			rollResult += `${rolledDice[0]}`;
			// console.log(rollResult);
			message.channel.send(rollResult);
		}

	},
};
