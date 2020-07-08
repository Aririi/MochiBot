const Discord = require('discord.js');
const { userColor, name } = require('../config.json');

module.exports = {
	name: 'user',
	description: 'Displays user information of author or mentioned user.',
	aliases: ['user-info'],
	execute(message) {
		if (!message.mentions.users.size) {
			if (message.channel.type === 'dm') {
				return message.channel.send(new Discord.MessageEmbed()
					.attachFiles(['./media/MochiBot-64.png'])
					.setColor(`${userColor}`)
					.setTitle(`${message.author.tag}`)
					.setThumbnail(`${message.author.displayAvatarURL()}?size=2048`)
					.setDescription('Here\'s what I know about this user:')
					.addFields(
						{ name: 'Last sent message:', value: `"${message.author.lastMessage}"` },
						{ name: 'Developer ID:', value: `\`${message.author.id}\`` },
						{ name: 'User was created at:', value: `${message.author.createdAt}` },
					)
					.setAuthor(`${name}'s User Summary`, 'attachment://MochiBot-64.png', 'https://github.com/[placeholderURL]')
					.setTimestamp()
					.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`),
				);
			}
			else {
				return message.channel.send(new Discord.MessageEmbed()
					.attachFiles(['./media/MochiBot-64.png'])
					.setColor(`${userColor}`)
					.setTitle(`${message.member.nickname} (${message.author.tag})`)
					.setThumbnail(`${message.author.displayAvatarURL()}`)
					.setDescription('Here\'s what I know about this user:')
					.addFields(
						{ name: 'Username:', value: message.author.tag },
						{ name: 'Last sent message:', value: `"${message.author.lastMessage}"` },
						{ name: 'Developer ID:', value: `\`${message.author.id}\`` },
						{ name: 'User was created at:', value: `${message.author.createdAt}` },
						{ name: 'Joined server on:', value: `${message.member.joinedAt}` },
					)
					.setAuthor(`${name}'s User Summary`, 'attachment://MochiBot-64.png', 'https://github.com/[placeholderURL]')
					.setTimestamp()
					.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`),
				);
			}
		}


		const userInfo = message.mentions.users.map(user => {
			if (message.channel.type === 'dm') {
				return (new Discord.MessageEmbed()
					.attachFiles(['./media/MochiBot-64.png'])
					.setColor(`${userColor}`)
					.setTitle(`${user.tag}`)
					.setThumbnail(`${user.displayAvatarURL()}`)
					.setDescription('Here\'s what I know about this user:')
					.addFields(
						{ name: 'User was created at:', value: `${user.createdAt}` },
						{ name: 'Last sent message:', value: `"${user.lastMessage}"` },
						{ name: 'Developer ID:', value: `\`${user.id}\``, inline: true },
					)
					.setAuthor(`${name}'s User Summary`, 'attachment://MochiBot-64.png', 'https://github.com/[placeholderURL]')
					.setTimestamp()
					.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`)
				);
			}
			else {
				return (new Discord.MessageEmbed()
					.attachFiles(['./media/MochiBot-64.png'])
					.setColor(`${userColor}`)
					.setTitle(`${message.mentions.members.first().nickname} (${user.tag})`)
					.setThumbnail(`${user.displayAvatarURL()}?size=256`)
					.setDescription('Here\'s what I know about this user:')
					.addFields(
						{ name: 'Username:', value: user.tag },
						{ name: 'User was created at:', value: `${user.createdAt}` },
						{ name: 'Last sent message:', value: `"${user.lastMessage}"` },
						{ name: 'Developer ID:', value: `\`${user.id}\``, inline: true },
						{ name: 'Joined server at:', value: `${message.mentions.members.first().joinedAt}` },
					)
					.setAuthor(`${name}'s User Summary`, 'attachment://MochiBot-64.png', 'https://github.com/[placeholderURL]')
					.setTimestamp()
					.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`)
				);
			}
		},
		);
		message.channel.send(userInfo);

	},
};
