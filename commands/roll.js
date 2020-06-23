const { prefix } = require('../config.json');
// Does random number gen, multiplies by dice type, then rounds to get result
module.exports = {
	name: 'roll',
	description: 'Rolls die with given amount of dice and given number of sides.',
	cooldown: 1.5,
	aliases: ['dice'],
	usage: '[amount][type]>',
	execute(message) {
		const regex = new RegExp(`^${prefix}roll|${prefix}dice`, 'gi');
		const rollArgs = message.content.replace(regex, '').split(/[d-]/, 2);
		//	rollArgs = rollArgs.split(/[d-]/, 2);
		// slices arg from message, then splits sets from d
		const amount = rollArgs[0];
		// gets first set after split from above
		const type = rollArgs[1];
		// same, but third (after d)
		console.log('Roll:', rollArgs, amount, type);
		if (rollArgs == null) {
			return message.reply('What amount/type of dice?.\n(Format: [amount][diceType])\nExample: `${prefix}roll 2d8`');
		}
		if (isNaN(amount)) {
			return message.reply(`invalid amount.\n\`(Format: [amount][diceType])\`\nExample: \`${prefix}roll 2d8\``);
		}
		if (isNaN(type)) {
			return message.reply(`invalid type.\n\`(Format: [amount][diceType])\`\nExample types: d2,d4,d7,d10\nExample: \`${prefix}roll 2d8\``);
		}
		if (type == 0) {
			return message.reply('Error: Zero-sided die don\'t exist yet.');
		}
		else if (amount == 1) {
			return message.channel.send(`One d${type} rolled a ${Math.ceil(Math.random() * type)}.`);
		}
		else if (type < 1 || type > 100) {
			return message.reply(`type of dice is limited from 1 to 100.\n(Format: [amount][diceType])\nExample: \`${prefix}roll 2d8\``);
		}
		else if (amount <= 1 || amount > 10) {
			return message.reply(`amount of dice needs to be 1-10.\n(Format: [amount][diceType])\nExample: \`${prefix}roll 2d8\``);
		}
		else if (amount == 2) {
			const result1 = Math.ceil(Math.random() * type);
			const result2 = Math.ceil(Math.random() * type);
			const total = result1 + result2;
			console.log(total);
			message.channel.send(`Rolled: [${result1}, ${result2}] => ${total}`);
		}
		else if (amount == 3) {
			const result1 = Math.ceil(Math.random() * type);
			const result2 = Math.ceil(Math.random() * type);
			const result3 = Math.ceil(Math.random() * type);
			const total = result1 + result2 + result3;
			message.channel.send(`Rolled: [${result1}, ${result2}, ${result3}] => ${total}`);
		}
		else if (amount == 4) {
			const result1 = Math.ceil(Math.random() * type);
			const result2 = Math.ceil(Math.random() * type);
			const result3 = Math.ceil(Math.random() * type);
			const result4 = Math.ceil(Math.random() * type);
			const total = result1 + result2 + result3 + result4;
			message.channel.send(`Rolled: [${result1}, ${result2}, ${result3}, ${result4}] => ${total}`);
		}
		else if (amount == 5) {
			const result1 = Math.ceil(Math.random() * type);
			const result2 = Math.ceil(Math.random() * type);
			const result3 = Math.ceil(Math.random() * type);
			const result4 = Math.ceil(Math.random() * type);
			const result5 = Math.ceil(Math.random() * type);
			const total = result1 + result2 + result3 + result4 + result5;
			message.channel.send(`Rolled: [${result1}, ${result2}, ${result3}, ${result4}, ${result5}] => ${total}`);
		}
		else if (amount == 6) {
			const result1 = Math.ceil(Math.random() * type);
			const result2 = Math.ceil(Math.random() * type);
			const result3 = Math.ceil(Math.random() * type);
			const result4 = Math.ceil(Math.random() * type);
			const result5 = Math.ceil(Math.random() * type);
			const result6 = Math.ceil(Math.random() * type);
			const total = result1 + result2 + result3 + result4 + result5 + result6;
			message.channel.send(`Rolled: [${result1}, ${result2}, ${result3}, ${result4}, ${result5}, ${result6}] => ${total}`);
		}
		else if (amount == 7) {
			const result1 = Math.ceil(Math.random() * type);
			const result2 = Math.ceil(Math.random() * type);
			const result3 = Math.ceil(Math.random() * type);
			const result4 = Math.ceil(Math.random() * type);
			const result5 = Math.ceil(Math.random() * type);
			const result6 = Math.ceil(Math.random() * type);
			const result7 = Math.ceil(Math.random() * type);
			const total = result1 + result2 + result3 + result4 + result5 + result6 + result7;
			message.channel.send(`Rolled: [${result1}, ${result2}, ${result3}, ${result4}, ${result5}, ${result6}, ${result7}] => ${total}`);
		}
		else if (amount == 8) {
			const result1 = Math.ceil(Math.random() * type);
			const result2 = Math.ceil(Math.random() * type);
			const result3 = Math.ceil(Math.random() * type);
			const result4 = Math.ceil(Math.random() * type);
			const result5 = Math.ceil(Math.random() * type);
			const result6 = Math.ceil(Math.random() * type);
			const result7 = Math.ceil(Math.random() * type);
			const result8 = Math.ceil(Math.random() * type);
			const total = result1 + result2 + result3 + result4 + result5 + result6 + result7 + result8;
			message.channel.send(`Rolled: [${result1}, ${result2}, ${result3}, ${result4}, ${result5}, ${result6}, ${result7}, ${result8}] => ${total}`);
		}
		else if (amount == 9) {
			const result1 = Math.ceil(Math.random() * type);
			const result2 = Math.ceil(Math.random() * type);
			const result3 = Math.ceil(Math.random() * type);
			const result4 = Math.ceil(Math.random() * type);
			const result5 = Math.ceil(Math.random() * type);
			const result6 = Math.ceil(Math.random() * type);
			const result7 = Math.ceil(Math.random() * type);
			const result8 = Math.ceil(Math.random() * type);
			const result9 = Math.ceil(Math.random() * type);
			const total = result1 + result2 + result3 + result4 + result5 + result6 + result7 + result8 + result9;
			message.channel.send(`Rolled: [${result1}, ${result2}, ${result3}, ${result4}, ${result5}, ${result6}, ${result7}, ${result8}, ${result9}] => ${total}`);
		}
		else if (amount == 10) {
			const result1 = Math.ceil(Math.random() * type);
			const result2 = Math.ceil(Math.random() * type);
			const result3 = Math.ceil(Math.random() * type);
			const result4 = Math.ceil(Math.random() * type);
			const result5 = Math.ceil(Math.random() * type);
			const result6 = Math.ceil(Math.random() * type);
			const result7 = Math.ceil(Math.random() * type);
			const result8 = Math.ceil(Math.random() * type);
			const result9 = Math.ceil(Math.random() * type);
			const result10 = Math.ceil(Math.random() * type);
			const total = result1 + result2 + result3 + result4 + result5 + result6 + result7 + result8 + result9 + result10;
			message.channel.send(`Rolled: [${result1}, ${result2}, ${result3}, ${result4}, ${result5}, ${result6}, ${result7}, ${result8}, ${result9}, ${result10}] => ${total}`);
		}
	},
};
