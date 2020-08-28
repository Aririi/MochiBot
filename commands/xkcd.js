const xkcd = require('xkcd');
const fetch = require('node-fetch');
const Discord = require('discord.js');
const { xkcdColor } = require('../config.json');

module.exports = {
	name: 'xkcd',
	description: 'Fetches XKCD comics. Provide \'latest\' to get the most recent, or nothing to get a random one.',
	usage: '<latest/number>',
	execute(message, args) {
		function compileEmbed(comic, title) {
			const comicEmbed = new Discord.MessageEmbed()
				.setColor(xkcdColor)
				.setTitle(`${title} ${comic.title}`)
				.attachFiles(['./media/xkcd.jpg'])
				.setAuthor('XKCD Comic', 'attachment://xkcd.jpg', `https://xkcd.com/${comic.num}/`)
				.setDescription(comic.alt)
				.setImage(comic.img)
				.setTimestamp()
				.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`);
			message.channel.send(comicEmbed);
		}

		async function checkNum() {
			const check = await fetch(`https://xkcd.com/${args[0]}/`);
			if (check.status === 404) {return message.channel.send(`${message.author.username}: That number returned a 404.`);}
			return xkcd(args[0], function(comic) {compileEmbed(comic, title);},
			);
		}
		let title = 'XKCD:';
		if (args[0] != undefined && !isNaN(args[0])) {checkNum();}
		else if (args[0] === 'latest') {
			title = 'Latest ' + title; xkcd(function(comic) {compileEmbed(comic, title);});
		}
		else {
			// gets the most recent comic to determine the latest issue, then gets a random comic using rng
			xkcd(function(comic, rng) {
				rng = Math.ceil(Math.random() * comic.num);
				if (rng > comic.num) {rng--;} title = 'Random ' + title;
				xkcd(rng, function(comic2) {compileEmbed(comic2, title);});
			});
		}

	},
};
