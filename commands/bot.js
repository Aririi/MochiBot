const Canvas = require('canvas');
const { createCanvas, Image } = require('canvas');

module.exports = {
	name: 'bot',
	description: 'Changes bot data. (devOnly)',
	usage: '<avatar/icon, username/name>',
	devOnly: true,
	args: true,
	execute(message, args, client) {
		async function getImage(url) {
			const img = await Canvas.loadImage(url); img.dataMode = Image.MODE_IMAGE;
			let canvas = createCanvas(img.width, img.height);
			const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0);
			canvas = canvas.toBuffer('image/png', { compressionLevel: 0 });
			return setAvatar(canvas, true);
		}
		function setAvatar(image, converted) {
			if(args[0] === undefined || !args[1].includes('https://')) {return message.channel.send('An image link is required.');}
			if (!converted) {return getImage(args[1]);}
			const oldID = client.user.avatar;
			client.user.setAvatar(image)
				.then(user => {
					if (oldID != user.avatar) {console.log('MGMT: Avatar updated.'); return message.channel.send('Avatar updated.');}
					else {return message.channel.send('Update failed.');}
				})
				.catch(error => {console.error(error); return message.channel.send('There was an error trying to update the image from the given file.');});
		}

		function setUsername() {
			args.shift(); const name = args.join(' ');
			client.user.setUsername(name).then(user => {
				console.log('MGMT: Username change to', user.username); message.channel.send(`${message.author.username}: My username is now ${user.username}`);
			});
		}


		switch (args[0]) {
		case 'avatar' || 'icon': setAvatar(); break;
		case 'username' || 'name': setUsername(); break;
		}
	},
};
