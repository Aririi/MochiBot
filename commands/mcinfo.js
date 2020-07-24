const Discord = require('discord.js');
const fetch = require('node-fetch');
const { mcColor } = require('../config.json');

module.exports = {
	name: 'mcinfo',
	description: 'Retrieves server status of a given Minecraft server using `api.mcsrvstat.us`',
	cooldown: 10,
	usage: '[ip address/hostname]',
	execute(message, args) {
		// function will use mcsrvstat API to get the status
		async function mcInfo(server, embedColor) {
			const mcstatus = await fetch(`https://api.mcsrvstat.us/2/${server}`)
				.then(response => response.json())
				.catch(error => console.error(error));

			//  if not online, status is unknown, therefore invalid or irretrievable, so exit.
			if (mcstatus.online != true) {return message.channel.send(`Could not get the status of \`${server}\``);}
			// otherwise, send an embed containing the fetched data.
			const serverStatus = new Discord.MessageEmbed(server, embedColor)
				.setColor(mcColor)
				.setTitle(`Server Status of \`${server}\``)
				.setDescription(mcstatus.motd.clean)
				.setThumbnail(`https://api.mcsrvstat.us/icon/${server}`)
				.addFields(
					{ name: 'Hostname:', value: `**${mcstatus.hostname}**` },
					{ name: 'Port:', value: mcstatus.port },
					{ name: 'Version:', value: mcstatus.version },
					{ name: 'Availability:', value: 'Online' },
					{ name: 'Currently playing:', value: `${mcstatus.players.online} out of ${mcstatus.players.max}` },
				)
				.setTimestamp()
				.setFooter(`Requested by ${message.author.username}`,
					`${message.author.displayAvatarURL({ dynamic:true })}?size=32`);

			message.channel.send(serverStatus).then(sentMessage => sentMessage.delete({ timeout: 60000 }));
		}

		// timeout message while data is fetched
		if (args[0] != undefined) {
			message.channel.send('Compiling matrices. Stand by...').then(sentMessage => {
				sentMessage.delete({ timeout: 1000 });
				mcInfo(args[0], mcColor);
			});

		}
		else {return message.channel.send(`${message.author.username}: You must provide a server address in order to check its status.`);}
	},
};
