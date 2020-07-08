const Discord = require('discord.js');
const { randomColor, name } = require('../config.json');
// TO DO: add parameter for second argument to allow looping (multiple calls in one message)

module.exports = {
	name: 'random',
	description: 'Uses a few APIs to get random media of the argument given (see usage list).',
	usage: '[avatar/icon/pfp, cat/meow, dog/woof, foxgirl, goose, gecg, kemonomimi, neko/nyan, nekogif/nyangif, waifu]',
	execute(message, args) {
		// required to init nekos.life wrapper
		const nekoLifeClient = require('nekos.life');
		const nekolife = new nekoLifeClient;

		// async functions to be executed based on the argument given
		async function randomAvatar() {
			const description = 'Here\'s a random avatar.';
			await nekolife.sfw.avatar().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomCat() {
			const description = 'Here\'s a random cat image/GIF.';
			await nekolife.sfw.meow().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomDog() {
			const description = 'Here\'s a random dog image/GIF.';
			await nekolife.sfw.woof().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomFoxgirl() {
			const description = 'Here\'s a random foxgirl image.';
			await nekolife.sfw.foxGirl().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomGoose() {
			const description = 'Here\'s a random goose image.';
			await nekolife.sfw.goose().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomGECG() {
			const description = 'Here\'s a random GECG (Genetically Engineered CatGirl) image.';
			await nekolife.sfw.gecg().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomHolo() {
			const description = 'Here\'s a random foxgirl image.';
			await nekolife.sfw.holo().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomKemonomimi() {
			const description = 'Here\'s a random kemonomimi image.';
			await nekolife.sfw.kemonomimi().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomLizard() {
			const description = 'Here\'s a random lizard image.';
			await nekolife.sfw.lizard().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomNeko() {
			const description = 'Here\'s a random neko image.';
			await nekolife.sfw.neko().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomNekoGIF() {
			const description = 'Here\'s a random neko GIF.';
			await nekolife.sfw.nekoGif().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomWaifu() {
			const description = 'Here\'s a random waifu image.';
			await nekolife.sfw.waifu().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		async function randomWallpaper() {
			const description = 'Here\'s a random wallpaper.';
			await nekolife.sfw.wallpaper().then(result => sendEmbed(randomColor, name, description, result.url));
		}
		// async function random() {
		// 	const result = await nekolife.sfw.[placeholder]().then(result => sendEmbed(randomColor, name, description, result)));
		// 	const description = 'Here\'s a random [placeholder] image.';
		// }


		// loops if second argument contains number
		if (isNaN(args[1]) === false) {
			if (args[1] > 15) {return message.channel.send('That\'s too many.');}
			else if (args[1] == 0) {return message.channel.send('Sending no random media.');}
			else {
				let loopCount = args[1];
				while (loopCount > 0) {
					setTimeout(randomTypeCheck, 1500);
					loopCount = loopCount - 1;
				}
			}
		}

		function randomTypeCheck() {
			// logical checks for what arg was passed, executing async funcs accordingly
			if (args[0] === 'avatar' || args[0] === 'icon' || args[0] === 'pfp') {randomAvatar();}
			else if (args[0] === 'cat' || args[0] === 'meow') {randomCat();}
			else if (args[0] === 'dog' || args[0] === 'woof') {randomDog();}
			else if (args[0] === 'goose' || args[0] === 'geese') {randomGoose();}
			else if (args[0] === 'foxgirl') {randomFoxgirl();}
			else if (args[0] === 'gecg' || args[0] === 'gmo') {randomGECG();}
			else if (args[0] === 'holo') {randomHolo();}
			else if (args[0] === 'kemonomimi') {randomKemonomimi();}
			else if (args[0] === 'lizard') {randomLizard();}
			else if (args[0] === 'neko' || args[0] === 'nyan') {randomNeko();}
			else if (args[0] === 'nekogif' || args[0] === 'nyangif') {randomNekoGIF();}
			else if (args[0] === 'waifu') {randomWaifu();}
			else if (args[0] === 'wallpaper') {randomWallpaper();}
			else {
				message.channel.send(`I don't know how to get "${args[0]}," maybe recommend it to the developer?`);
			}
		}
		function sendEmbed(randomColor, name, description, result) {
			const randomMediaEmbed = new Discord.MessageEmbed(randomColor, name, description, result)
				.setColor(`${randomColor}`)
				.setTitle(`${name}'s Image Database`)
				.setDescription(description)
				.addFields({ name: 'Source:', value: result })
				.setImage(result)
				.setTimestamp()
				.setFooter(`Requested by ${message.author.username}`,
					`${message.author.displayAvatarURL({ dynamic:true })}?size=32`);

			message.channel.send(randomMediaEmbed);

		}
	},
};
