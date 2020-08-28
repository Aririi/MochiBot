const { prefix } = require('../config.json');
// note: Collection#find(Obj => Obj.key == "value")
module.exports = {
	name: '',
	description: '',
  cooldown: #,
	aliases: ['',''],
	guildOnly: true/false,
	usage: '<>',
	devOnly: true/false,
	execute(message) {

  }
};

// send message -- message.channel.send()

// imbed
	// at the top of your file
	const Discord = require('discord.js');

	// inside a command, event listener, etc.
	const exampleEmbed = new Discord.MessageEmbed()
		.setColor('#0099ff')
		.setTitle('Some title')
		.setURL('https://discord.js.org/')
		.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
		.setDescription('Some description here')
		.setThumbnail('https://i.imgur.com/wSTFkRM.png')
		.addFields(
			{ name: 'Regular field title', value: 'Some value here' },
			{ name: '\u200B', value: '\u200B' },
			{ name: 'Inline field title', value: 'Some value here', inline: true },
			{ name: 'Inline field title', value: 'Some value here', inline: true },
		)
		.addField('Inline field title', 'attachment://MochiBot-64.png', true)
		.setImage('https://i.imgur.com/wSTFkRM.png')
		.setTimestamp()
		.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

	channel.send(exampleEmbed);

	//

// if no user mentioned
	if (!message.mentions.users.size) {
		return
	}
	// uses mentioned user as 'user'
	const commandVar = message.mentions.users.map(user => {
		return
	},
	);
	message.channel.send(commandVar);
},
};

	//
