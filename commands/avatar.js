const Discord = require('discord.js');
const { userColor } = require('../config.json');

module.exports = {
	name: 'avatar',
	description: 'Get the avatar URL of the mentioned user, or your own avatar if none are tagged.',
	aliases: ['icon', 'pfp'],
	execute(message) {
		// if none mentioned, provides authors avatar
		if (!message.mentions.users.size) {
			// console.log(message.author.displayAvatarURL({ dynamic:true }));
			return message.channel.send(new Discord.MessageEmbed()
				.attachFiles(['../MochiBot.js/media/MochiBot-64.png'])
				.setColor(userColor)
				.setTitle(`${message.member.nickname} (${message.author.tag})`)
				.setImage(`${message.author.displayAvatarURL({ dynamic:true })}?size=2048`)
				.setAuthor('MochiBot\'s User Database', 'attachment://MochiBot-64.png', 'https://github.com/[placeholderURL]')
				.setTimestamp()
				.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`),
			);
		}


		const userAvatar = message.mentions.users.map(user => {
			console.log(user.displayAvatarURL({ dynamic:true }));
			return (new Discord.MessageEmbed()
				.attachFiles(['../MochiBot.js/media/MochiBot-64.png'])
				.setColor(`${userColor}`)
				.setTitle(`${message.mentions.members.first().nickname} (${user.tag})`)
				.setImage(`${user.displayAvatarURL({ dynamic:true })}?size=2048`)
				// .setDescription(`This is ${user.username}'s icon:`)
				.setAuthor('MochiBot\'s User Info', 'attachment://MochiBot-64.png', 'https://github.com/[placeholderURL]')
				.setTimestamp()
				.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}`)
			);
		},
		);
		message.channel.send(userAvatar);
	},
};
