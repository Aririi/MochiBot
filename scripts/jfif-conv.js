const Discord = require('discord.js');
const Canvas = require('canvas');
const { createCanvas, Image } = require('canvas');

module.exports = {
	name: 'jfif-conv',
	execute(message) {
		function sendConverted(img, name) {
			const attachment = new Discord.MessageAttachment(img, name.replace('.jfif', '.jpg'));
			return message.channel.send(`Converted \`${name}\` to JPG:`, attachment).catch(error => console.error(error));
		}
		async function convertJPG(file) {
			const img = await Canvas.loadImage(file.proxyURL); img.dataMode = Image.MODE_IMAGE;
			const canvas = createCanvas(img.width, img.height);
			const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
			canvas.toDataURL('image/jpeg', 1); canvas.toBuffer('image/jpeg');
			return sendConverted(canvas, file.name);
		}
		message.attachments.forEach(file => {if (file.name.endsWith('.jfif')) {convertJPG(file);}});
	},
};
