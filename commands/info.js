const Discord = require('discord.js');
const { name, prefix, infoColor } = require('../config.json');
const alias = name.toLowerCase();

module.exports = {
	name: 'info',
	description: 'Shows bot info.',
	aliases: ['information', 'about', 'bot', alias],
	execute(message) {
		// sends temp message while embed sends
		message.channel.send('Compiling matrices. Stand by...').then(sentMessage => {
			sentMessage.delete({ timeout: 1000 });
			const InfoEmbed = new Discord.MessageEmbed()
				.setColor(`${infoColor}`)
				.setTitle(`About ${name}`)
				.attachFiles(['./media/MochiBot.png'])
				.setThumbnail('attachment://MochiBot.png')
				.setDescription(`
					${name} was originally designed for Yee Yee University.
					Completed or WIP functionality: Quotes, reactions, points, gifs, images, games, and more.
					Largely inspired from LanteaBot/MichiBot by Michiyo on the OpenComputers server.`)
				.addFields(
					{ name: 'Development Start Date:', value: 'April 1st, 2020' },
					{ name: 'Author:', value: 'Ariri#7998', inline: true },
					{ name: 'Help:', value: `\`${prefix}help\`` },
					{ name: `${name}'s prefix in this server: \`${prefix}\``, value: '\u200B', inline: false },
				)
				.setAuthor(name, 'attachment://MochiBot.png', 'https://github.com/Aririi/MochiBot')
				.setTimestamp()
				.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`);

			message.channel.send(InfoEmbed);

		});
	},
};
