// require the discord.js module and config
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

// create a new Discord client
const client = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

// begin command section
// client.on('message', message => {


client.on('message', message => {
	console.log(message.content);
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

  if (command === 'ping') {
  		message.channel.send('Pong.');
  	} else if (command === 'beep') {
  		message.channel.send('Boop.');
  	} else if (command === 'server') {
  		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  	} else if (command === 'user-info') {
  		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
  	} else if (command === 'test') {
  		if (!args.length) {
  			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
  		} else if (args[0] === 'foo') {
  			return message.channel.send('bar');
  		}

  		message.channel.send(`First argument: ${args[0]}`);
  	} else if (command === 'kick') {
  		if (!message.mentions.users.size) {
  			return message.reply('you need to tag a user in order to kick them!');
  		}

  		const taggedUser = message.mentions.users.first();

  		message.channel.send(`You wanted to kick: ${taggedUser.username}`);
  	} else if (command === 'avatar') {
  		if (!message.mentions.users.size) {
  			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL}>`);
  		}

  		const avatarList = message.mentions.users.map(user => {
  			return `${user.username}'s avatar: <${user.displayAvatarURL}>`;
  		});

  		message.channel.send(avatarList);
  	} else if (command === 'prune') {
  		const amount = parseInt(args[0]) + 1;

      if (args[0] === 'juice') {
       return message.channel.send('Not that kind of prune, silly!');
      }
  		if (isNaN(amount)) {
  			return message.reply('that doesn\'t seem to be a valid number.');
  		} else if (amount <= 1 || amount > 100) {
  			return message.reply('you need to input a number between 1 and 99.');
  		}
  		message.channel.bulkDelete(amount, true).catch(err => {
  			console.error(err);
  			message.channel.send('There was an error trying to prune messages in this channel!');

  		});
  	}
  });

// 	console.log(message.content);
// 	if (message.content.startsWith(`${prefix}ping`)) {
// 	// send back "Pong." to the channel the message was sent in
// 		message.channel.send('Pong.');
// 	}
// 	else if (message.content === `${prefix}beep`) {
// 		message.channel.send('Boop.');
// 	}
// 	else if (message.content === 'uwu') {
// 		message.channel.send('UwU');
// 	}
// 	else if (message.content === `${prefix}server`) {
// 		message.channel.send(`This server's name is: ${message.guild.name}`);
// 	}
// 	else if (message.content === `${prefix}server stats`) {
// 		message.channel.send(`This server's name is: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nCreated: ${message.guild.createdAt}\nRegion: ${message.guild.region}`);
// 	}
// 	else if (message.content === `${prefix}user-info`) {
// 		message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
// 	}
// });

// login to Discord with your app's token
client.login(token);
