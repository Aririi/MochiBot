const { prefix, helpColor } = require('../config.json');
const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Lists all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;
		const HelpEmbed = new Discord.MessageEmbed()
			.setColor(helpColor)
			.setTitle('MochiBot\'s Commands:')
			.attachFiles(['../MochiBot.js/media/MochiBot-64.png'])
			.setThumbnail('attachment://MochiBot-64.png')
			.addFields(
				{ name: 'Command List:', value: `\`${commands.map(command => command.name).join(', ')}\`` },
				{ name: 'How to get more information:', value: `\nYou can send \`${prefix}help [command name]\` to get info on a specific command.` },
				{ name: 'MochiBot\'s prefix in this server:', value: `\`${prefix}\`` },
			)
			.setAuthor('MochiBot Matrix', 'attachment://MochiBot-64.png', 'https://github.com/[placeholderURL]')
			.setTimestamp()
			.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`);
		// checks if command was from dm and provides differently formatted reply
		if (!args.length) {
			if (message.channel.type === 'dm') {
				// message.reply(`${message.author.username}, here's a list of all my commands:`);
				// message.channel.send(`\`${commands.map(command => command.name).join(', ')}\``);
				// message.channel.send(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command.`);
				//
				// return message.author.send(data, { split: true });
				return message.author.send(HelpEmbed);
			}
			else {
				// message.reply('here\'s a list of all my commands:');
				// message.channel.send(`\`${commands.map(command => command.name).join(', ')}\``);
				// message.channel.send(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command.`);
				return message.channel.send(HelpEmbed);
				// return message.author.send(data, { split: true });
			}
		}

		// looks for commands under the name of the first arg
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		data.push(`**Name:** ${command.name}`);

		// provides info from the command if exists
		if (command.aliases) data.push(`**Aliases:** \`${command.aliases.join(', ')}\``);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** \`${prefix}${command.name} ${command.usage}\``);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};
