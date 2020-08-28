const { prefix } = require('../config.json');
// Does random number gen, multiplies by dice type, then rounds to get result
module.exports = {
	name: 'roll',
	description: 'Rolls die with given amount of dice and given number of sides.',
	cooldown: 1.5,
	aliases: ['dice'],
	usage: '<amount][type>',
	args: true,
	execute(message, args) {
		// splits first arg into amount and type
		const rollArgs = args[0].split(/[d-]/, 2);
		let amount = rollArgs[0]; const type = rollArgs[1];
		// if (args[0] === undefined) {return message.send(`${message.author.username}: What amount/type of dice?.\n(Format: [amount][diceType])\nExample: \`${prefix}roll 2d8\``);}
		if (args[0].slice(0, 1) === 'd') {amount = 1;}
		if (isNaN(amount)) {return message.channel.send(`${message.author.username}: Invalid amount.\nExample: \`${prefix}roll 2d8\``); }
		if (isNaN(type)) {return message.channel.send(`${message.author.username}: Invalid type.\n\`Example types: d2,d4,d7,d10\nExample: \`${prefix}roll 2d8\``);}
		if (type == 0) {return message.channel.send(`${message.author.username}: Error: Zero-sided die don't exist yet.`);}
		if (amount == 1) {return message.channel.send(`One d${type} rolled a ${Math.ceil(Math.random() * type)}.`);}
		if (type < 0 || type > 999) {return message.channel.send(`${message.author.username}: Type of dice is limited from 1 to 9999.\nExample: \`${prefix}roll 2d8\``);}
		if (amount < 1 || amount > 199) {return message.channel.send(`${message.author.username}: Amount of dice needs to be between 1-9999.\nExample: \`${prefix}roll 2d8\``);}
		else {
			let results = [];
			for (let i = amount; i > 0; i--) {results[i - 1] = Math.ceil(Math.random() * type);}
			const rolledDice = results; results = results.join(', ');
			// first part of text to send, before results changes back to an array
			let rollResult = `Rolled: [${results}] => `;
			results = results.split(', ');
			// loops the result array, adding it to itself
			for (let i = rolledDice.length - 2; i >= 0; i--) {
				// pops a number from the array and adds it to the first element
				if (results[1] != undefined) {rolledDice[0] = Number(rolledDice.pop()) + Number(rolledDice[0]);}
			}
			rollResult += `${rolledDice[0]}`; message.channel.send(rollResult).catch(error => {return console.error(error);});
		}
	},
};
