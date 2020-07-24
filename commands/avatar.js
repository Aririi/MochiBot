const Discord = require('discord.js');
const { userColor } = require('../config.json');
let title;

function findUser(message, args, sendAvatar) {
	const userRegex = new RegExp(`(${args.join(' ')})`, 'g');
	let matchFound = false;
	// fetches all members and checks each if there's a match
	message.guild.members.fetch()
		.then(members => {
			members.forEach(member => {
				// will not look for a match if one was already found, that way searches are in order as looped
				if (!matchFound) {
					// checks if user data array has nickname to avoid errors
					if (member.nickname != null) {
						if (member.user.username.match(userRegex)) {matchFound = true; return sendAvatar(member.user, member.nickname);}
						else if (member.nickname.match(userRegex)) {matchFound = true; return sendAvatar(member.user, member.nickname);}
					}
					else if (member.user.username.match(userRegex)) {matchFound = true; return sendAvatar(member.user);}
				}
			});
			if (!matchFound) {message.channel.send('Couldn\'t find that user...');}
		},
		).catch(error => console.log(error));
}


module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the mentioned user, or your own avatar if none are tagged.',
	aliases: ['icon', 'pfp'],
	usage: '[username/nickname]',
	execute(message, args, client) {
		if (args[0] != undefined) {
			const userID = args[0].match(/^<@!?(\d+)>$/);
			// if DM, searching not possible
			if (message.channel.type === 'dm') {
				if (!userID) {message.channel.send('You can\'t search for other user\'s avatars in a DM.');}
				else {client.users.fetch(userID[1]).then(user => sendAvatar(user));}
			}
			// if in a guild, search is possible
			else if (!userID && message.channel.type != 'dm') {findUser(message, args, sendAvatar);}
			else {message.guild.members.fetch(userID[1]).then(user => sendAvatar(user.user, user.nickname));}
		}
		else if (message.channel.type === 'dm') {sendAvatar(message.author);}
		else {message.guild.members.fetch(message.author.id).then(user => sendAvatar(user.user, user.nickname));}

		function sendAvatar(user, nickname) {
			// determines if a nickname can be found, then sets the title accordingly
			if (message.channel.type === 'dm') {title = user.tag;}
			else if (nickname != undefined) {title = `${nickname} (${user.tag})`;}
			else {title = user.tag;}

			const avatarEmbed = new Discord.MessageEmbed()
				.attachFiles(['./media/MochiBot-64.png'])
				.setColor(userColor)
				.setTitle(title)
				.setImage(`${user.displayAvatarURL({ dynamic:true })}?size=2048`)
				.setAuthor('MochiBot\'s User Database', 'attachment://MochiBot-64.png', 'https://github.com/Aririi/MochiBot')
				.setTimestamp()
				.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`);
			message.channel.send(avatarEmbed);
		}
	},
};
