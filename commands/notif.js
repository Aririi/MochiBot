const { prefix } = require('../config.json');

module.exports = {
	name: 'notif',
	description: 'Sets notifications for the author based on voice channel activity, or a keyword. (WIP)',
	aliases: ['notifyme', 'notifywhen'],
	guildOnly: true,
	usage: '<vc/word> <count (if for vc)> <name or word (case sensitive)>',
	execute(message, args, a, b, c, notifDB) {
		if (args[0] === 'vc') {checkValidVC();}
		else {return message.channel.send(`${message.author.username}: Could not determine what type of notification you want, currently \`vc\` (voice channel) is supported.`);}

		function checkValidVC() {
			args.shift(); const count = args.shift();
			const name = args.join(' '); let match = false;
			// fetches every channel name to get a match for args given (after the first two (type and count))
			const channels = message.guild.channels.cache;
			channels.filter(channel => {
				if (!match) {
					if (channel.name.startsWith(name) && channel.type === 'voice') {makeVCnotif(channel.id, channel.name, count); match = true;}
				}
			});
			if (!match) {return message.channel.send(`${message.author.username}: Could not find a voice channel with that name, please check spelling and capitalization.`);}
		}

		function makeVCnotif(id, name, count) {
			if (isNaN(count)) {return message.channel.send(`${message.author.username}: You must provide a valid number in the second argument.`);}
			const vcDoc = { ID: message.author.id, vc: id, count: count };
			// this will be pulled by the vc notifcation script from index
			notifDB.insert(vcDoc, function(err, newDoc) {
				if (err) {return console.error(err);}
				const text = `${message.author.username}: I will notify you when there are ${count} member(s) in the voice channel "${name}"\nIf you would like to remove this notification at any time, use \`${prefix}delnotif ${newDoc._id}\``;
				return message.channel.send(text);
			});
		}
	},
};
