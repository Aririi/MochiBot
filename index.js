// require the discord.js module and config
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, owner } = require('./config.json');
const Datastore = require('nedb');
const db = new Datastore({ filename: './databases/rep.db', autoload: true });
// const { readyUserActivity } = require('./commands/randomstatus.js');

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
		message.content.includes(['setstatus', 'setpresence', 'setactivity', 'randomstatus', 'shufflestatus', 'restart']) === false) {
	// Random chance to change the status, unless the command is one of those blacklisted above
		const randomNumber = (Math.floor(Math.random() * 20));
		if (randomNumber >= 19) {
			randomStatus();
			console.log('The last message generated a value greater than 19, so the status will now change.');
		}
	}

	// if (!message.content.startsWith(prefix) || message.author.bot) return;

	// checks if contains bot's prefix and executes accordingly
	if (!message.content.startsWith(prefix)) {

		// checks if a user was mentioned (not a command) along with '++' for the rep system
		if (message.content.endsWith('++') === true && message.channel.type == 'text' && message.mentions.users.first() != undefined) {
			// console.log('Match successful, attempting to add rep. points.');
			repFind(message);
		}
	}

	else {
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

function repFind(message) {
	// adds a rep point to the user mentioned with ++ (Example: MochiBot++)
	// console.log(`repFind: Given ID was ${message.mentions.users.first()}`);
	const userToRepInfo = message.mentions.users.first();
	const userToRepID = userToRepInfo.id;
	if (message.author.id === userToRepID) {return message.channel.send(`${message.author.username}: You cannot give yourself points.`);}
	// searches the db for the user mentioned
	db.find({ _id: userToRepID }, function(err, docs) {
		// error catch w/ initial find function
		if (err != null) {
			message.channel.send('There was an error trying to find that user in the database.');
			console.log(`DB ERROR: Could not search successfully: ${err}`);
		}
		// if no matches, create an entry in the db
		if (docs[0] === undefined) {
			console.log('Failure to find a matching ID, creating a new entry...');
			db.insert([{ _id: userToRepID, points: 0, name: userToRepInfo.username }], function(err) {
				// error catch with entry attempt
				if (err != null) {
					message.channel.send('There was an error creating a new entry.');
					console.log(`DB ERROR: Failed to make new entry. '${err}'`);
				}
				// if the new entry was successfully created, rerun the function so a point will be added
				else {
					// console.log('Entry created.');
					repFind(message);
				}
			});
		}
		// if a match was found, add a point
		else if (docs[0] != undefined) {
			repAdd(message, docs, userToRepID, userToRepInfo);
		}
	});
}

function repAdd(message, docs, userToRepID, userToRepInfo) {
	// adds one point to the existing for the first match (since its a uuid, only one should exist)
	console.log(`repAdd: Adding one point to ${userToRepID}...`);
	const newPoints = docs[0].points + 1;
	db.update({ _id: userToRepID }, { _id: userToRepID, points: newPoints, name: userToRepInfo.username }, {}, function(err) {
		// error catch if adding points fails
		if (err != null) {
			message.channel.send('There was an error adding a point to the user.');
			console.log(`DB ERROR: Failed to update existing entry. '${err}'`);
		}
		else {
			// console.log('Point successfully added.');
			return message.channel.send(`<@${userToRepID}> now has ${newPoints} point(s).`);
		}
	});
}

// login to Discord with your app's token
client.login(token);
