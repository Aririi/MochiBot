module.exports = {
	name: 'prune',
	description: 'Deletes messages in the amount specified (1 to 99.)',
	aliases: ['delete', 'purge'],
	guildOnly: true,
	execute(message, args) {
		const amount = parseInt(args[0]) + 1;

		if (args[0] === 'juice') {
			return message.channel.send('Not that kind of prune, silly!');
		}
		// checks if arg is juice, for comedical purpose

		if (isNaN(amount)) {
			return message.reply('that doesn\'t seem to be a valid number.');
		}
		else if (amount <= 1 || amount > 100) {
			return message.reply('you need to input a number between 1 and 99.');
		}

		if (message.member.hasPermission('MANAGE_MESSAGES') == true) {
			message.channel.bulkDelete(amount, false).catch(err => {
				console.error(err);
				message.channel.send('There was an error trying to prune messages in this channel!');
			})
				.then(console.log(`Deleted ${amount} messages per ${message.author.tag}'s request.`));
		}
		else {
			return message.reply('you need the \'Manage Messages\' permssion for this command.');
		}
	},
};
