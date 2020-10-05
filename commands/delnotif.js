module.exports = {
	name: 'delnotif',
	description: 'Removes the given notification. (WIP)',
	aliases: ['deletenotif', 'removenotif'],
	usage: '<notification ID>',
	args: true,
	execute(message, args, a, b, c, notifDB) {
		notifDB.remove({ _id: args[0] }, {}, function(err, numRmd) {
			if (err) {return console.error(err);}
			if (numRmd > 0) {return message.channel.send(`${message.author.username}: Notification with ID \`${args[0]}\` was successfully removed.`);}
			else {return message.channel.send(`${message.author.username}: A notification with that ID was not found.`);}
		});
	} };
