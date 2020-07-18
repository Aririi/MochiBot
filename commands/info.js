const Discord = require('discord.js');
const { prefix, infoColor } = require('../config.json');

module.exports = {
	name: 'info',
	description: 'Shows bot info.',
	aliases: ['information', 'about', 'mochibot', 'bot'],
	execute(message) {
		// sends temp message while embed sends
		message.channel.send('Compiling matrices. Stand by...').then(sentMessage => {
			sentMessage.delete({ timeout: 1000 });
			const InfoEmbed = new Discord.MessageEmbed()
				.setColor(`${infoColor}`)
				.setTitle('About MochiBot')
				.attachFiles(['./media/MochiBot.png'])
				.setImage('attachment://MochiBot.png')
				.setDescription('MochiBot was originally designed for Yee Yee University.\nContains emojis, quotes, reactions, points, gifs, images, and more.\nLargely inspired and derived from LanteaBot/MichiBot by Michiyo on OpenComputers.')
				.addFields(
					{ name: 'Development Start Date:', value: 'April 1st, 2020' },
					{ name: 'Author:', value: 'Ariri#7998' },
					{ name: 'Help:', value: `\`${prefix}help\`` },
				)
				.setAuthor('MochiBot', 'attachment://MochiBot.png', 'https://github.com/Aririi/MochiBot')
				.setTimestamp()
				.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`);

			message.channel.send(InfoEmbed);

		});
	},
};
