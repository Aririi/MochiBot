const Discord = require('discord.js');
const { randomColor, name, owner } = require('../config.json');
const sfwClient = require('nekos.life');
const { sfw } = new sfwClient;
const max = 8;

module.exports = {
	name: 'random',
	description: `Uses a few APIs to get random media of the argument given (see usage list). Limited to ${max} loops per command.`,
	usage: '<avatar/icon/pfp, cat/meow, dog/woof, foxgirl, goose, gecg, kemonomimi, neko/nyan, nekogif/nyangif, waifu] [#(opt)>',
	args: true,
	execute(message, args) {

		function sendEmbed(description, result) {
			const randomMediaEmbed = new Discord.MessageEmbed(randomColor, name, description, result)
				.setColor(`${randomColor}`)
				.setTitle(`${name}'s Image Database`)
				.setDescription(description)
				.addFields({ name: 'Source:', value: result })
				.setImage(result)
				.setTimestamp()
				.setFooter(`Requested by ${message.author.username}`, `${message.author.displayAvatarURL({ dynamic:true })}?size=32`);
			message.channel.send(randomMediaEmbed);
		}

		let match = false; let description = 'Here\'s a ';
		// async functions to be executed based on the argument given
		async function randomAvatar() {
			description += 'random avatar.';
			await sfw.avatar().then(result => sendEmbed(description, result.url));
		}
		async function randomCat() {
			description += 'random cat image/GIF.';
			await sfw.meow().then(result => sendEmbed(description, result.url));
		}
		async function randomDog() {
			description += 'random dog image/GIF.';
			await sfw.woof().then(result => sendEmbed(description, result.url));
		}
		async function randomFoxgirl() {
			description += 'random foxgirl image.';
			await sfw.foxGirl().then(result => sendEmbed(description, result.url));
		}
		async function randomGoose() {
			description += 'random goose image.';
			await sfw.goose().then(result => sendEmbed(description, result.url));
		}
		async function randomGECG() {
			description += 'random GECG (Genetically Engineered CatGirl) image.';
			await sfw.gecg().then(result => sendEmbed(description, result.url));
		}
		async function randomHolo() {
			description += 'random foxgirl image.';
			await sfw.holo().then(result => sendEmbed(description, result.url));
		}
		async function randomKemonomimi() {
			description += 'random kemonomimi image.';
			await sfw.kemonomimi().then(result => sendEmbed(description, result.url));
		}
		async function randomLizard() {
			description += 'random lizard image.';
			await sfw.lizard().then(result => sendEmbed(description, result.url));
		}
		async function randomNeko() {
			description += 'random neko image.';
			await sfw.neko().then(result => sendEmbed(description, result.url));
		}
		async function randomNekoGIF() {
			description += 'random neko GIF.';
			await sfw.nekoGif().then(result => sendEmbed(description, result.url));
		}
		async function randomWaifu() {
			description += 'random waifu image.';
			await sfw.waifu().then(result => sendEmbed(description, result.url));
		}
		async function randomWallpaper() {
			description += 'random wallpaper.';
			await sfw.wallpaper().then(result => sendEmbed(description, result.url));
		}
		async function randomFact() {
			await sfw.fact().then(result => message.channel.send(`${message.author.username}: ${result.fact}.`));
		}

		// loops if second argument contains number
		if (!isNaN(args[1])) {
			if (args[1] > max && message.author.id != owner) {return message.channel.send(`${message.author.username}: That's too many. (Max is ${max})`);}
			else if (args[1] == 0) {return message.channel.send(`${message.author.username}: Sending no random media.`);}
			else {
				let loopCount = args[1];
				while (loopCount > 0) {
					setTimeout(randomTypeCheck, 2000); loopCount = loopCount - 1;
				}
			}
		}
		else {randomTypeCheck();}

		function randomTypeCheck() {
			// logical checks for what arg was passed, executing async funcs accordingly
			if (args[0] === 'avatar' || args[0] === 'icon' || args[0] === 'pfp') {return randomAvatar();}
			else if (args[0] === 'cat' || args[0] === 'meow') {return randomCat();}
			else if (args[0] === 'dog' || args[0] === 'woof') {return randomDog();}
			else if (args[0] === 'goose' || args[0] === 'geese') {return randomGoose();}
			else if (args[0] === 'foxgirl') {return randomFoxgirl();}
			else if (args[0] === 'gecg' || args[0] === 'gmo') {return randomGECG();}
			else if (args[0] === 'holo') {return randomHolo();}
			else if (args[0] === 'kemonomimi') {return randomKemonomimi();}
			else if (args[0] === 'lizard') {return randomLizard();}
			else if (args[0] === 'neko' || args[0] === 'nyan' || args[0] === 'catgirl') {return randomNeko();}
			else if (args[0] === 'nekogif' || args[0] === 'nyangif' || args[0] === 'catgirlgif') {return randomNekoGIF();}
			else if (args[0] === 'waifu') {return randomWaifu();}
			else if (args[0] === 'wallpaper') {return randomWallpaper();}
			else if (args[0] === 'fact') {return randomFact();}
			else if (!match) {message.channel.send(`I don't know how to get "${args[0]}," maybe recommend it to the developer?`); return match = true;}
		}
	},
};
