const Discord = require('discord.js');
const { prefix, serverColor } = require('../config.json');

module.exports = {
	name: 'server',
	description: 'Displays server information.',
	guildOnly: true,
	aliases: ['server-info'],
	execute(message) {
		// console.log(message.guild.icon);
		const ServerInfo = new Discord.MessageEmbed()
			.setColor(serverColor)
			.setTitle(`${message.guild.name}`)
			.attachFiles(['./media/MochiBot-64.png'])
			.setThumbnail(`https://cdn.discordapp.com/icons/${message.guild.icon}.png?size=128`)
			// .setDescription('MochiBot was origally designed for Yeeyee University.\nContains emojis, quotes, reactions, points, gifs, images, and more.')
			.addFields(
				{ name: 'Server Name:', value: `${message.guild.name}`, inline: true },
				{ name: 'Server Owner:', value: `${message.guild.owner}`, inline: true },
				{ name: 'Server Region:', value: `${message.guild.region}`, inline: true },
				{ name: 'Nitro Premium Tier:', value: `${message.guild.premiumTier}`, inline: true },
				{ name: 'Nitro Booster count:', value: `${message.guild.premiumSubscriptionCount}`, inline: true },
				{ name: 'MochiBot\'s prefix in this server:', value: `\`${prefix}\``, inline: false },
			)
			.setAuthor('MochiBot\'s Server Summary', 'attachment://MochiBot-64.png', 'https://github.com/[placeholderURL]')
			.setTimestamp()
			.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`);

		message.channel.send(ServerInfo);
	// Server name: ${message.guild.name}
	// Total members: ${message.guild.memberCount}
	// Created: ${message.guild.createdAt}
	// Region: ${message.guild.region}
	// Server owner: ${message.guild.owner}
	// Amount of Boosts: ${message.guild.premiumSubscriptionCount}
	// Premium Tier: ${message.guild.premiumTier}`);
	},
};
