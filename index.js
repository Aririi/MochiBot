// require the discord.js module and config
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, owner } = require('./config.json');

// create a new Discord client
const client = new Discord.Client();

const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log(`User Tag: ${client.user.tag}`);
	console.log(`User ID: ${client.user.id}`);
	console.log(`${client.user.username} is ready for action! :3`);
	randomStatus();
	client.on('shardError', error => {
		console.error('A websocket connection encountered an error:', error);
	});

	process.on('unhandledRejection', error => {
		console.error('Unhandled promise rejection:', error);
	});
});


// begin command section
client.on('message', message => {
	console.log(`[${message.author.tag}: ${message.content}]`);

	if (
		message.content.includes(['setstatus', 'setpresence', 'setactivity', 'randomstatus', 'shufflestatus', 'restart']) == false) {
	// Random chance to change the status, unless the command is one of those blacklisted above
		const randomNumber = (Math.floor(Math.random() * 20));
		if (randomNumber >= 19) {
			randomStatus();
			console.log('The last message generated a value greater than 19, so the status will now change.');
		}

		if (!message.content.startsWith(prefix) || message.author.bot) return;

		// splits off prefix and makes following text into lowercase
		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		// finds command and aliases from list
		const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send('That\'s not a command I recognize.');
		if (message.author.bot) return;

		// checks if command is server-only via command property
		if (command.guildOnly && message.channel.type !== 'text') {
			return message.reply('I can\'t execute that command inside DMs.');
		}
		// checks if command is locked to dev use
		if (message.author.id != owner && command.devOnly == true) {
			return	message.reply('you do not have permission to execute this command (devOnly).');
		}

		// looks for arguments if needed
		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}.`;

			// provides proper usage
			if (command.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime && message.author.id != owner) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


		try {
			command.execute(message, args, client);
		}
		catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command.');
			message.channel.send(error).catch(console.error);
		}
	}
});


function randomStatus() {
	// randomly sets status based on RNG
	const randomNumberResult = (Math.floor(Math.random() * 6));
	const readyUserActivity = [
		['PLAYING', 'with bits and bytes.'],
		['PLAYING', 'with code blocks.'],
		['PLAYING', 'red pill or blue pill?'],
		['PLAYING', 'Materialization Shiritori.'],
		['WATCHING', 'out for the Unseen Horizon.'],
		['LISTENING', 'the awakening of the Dark Flame Master.'],
	];
	client.user.setActivity(readyUserActivity[randomNumberResult][1], { type: readyUserActivity[randomNumberResult][0] })
		.then(console.log(`The status has been changed to '${readyUserActivity[randomNumberResult][0]} ${readyUserActivity[randomNumberResult][1]}'`))
		.catch(console.error);
}


// login to Discord with your app's token
client.login(token);
