// require the discord.js module and config
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, owner } = require('./config.json');
const Datastore = require('nedb');
const repDB = new Datastore({ filename: './databases/rep.db', autoload: true });
const timeDB = new Datastore({ filename: './databases/reminders.db', autoload: true });
const client = new Discord.Client();
// TO DO library/file for possible statuses — const { readyUserActivity } = require('./commands/randomstatus.js');

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
client.once('ready', () => {
	console.log(`User Tag: ${client.user.tag}\nUser ID: ${client.user.id}\n${client.user.username} is ready for action! :3`);
	randomStatus(); reminderCheck();
});

// initial launch and connection issue handles
client.on('shardError', error => {console.error('A websocket connection encountered an error:', error);});
process.on('unhandledRejection', error => {console.error('Unhandled promise rejection:', error);});

// begin command section
client.on('message', message => {
	console.log(`[${message.author.tag}: ${message.content}]`);

	if (!message.content.includes(['setstatus', 'setpresence', 'setactivity', 'randomstatus', 'shufflestatus', 'restart'])) {
	// random chance to change the status, unless the command is one of those blacklisted above
		const randomNumber = (Math.floor(Math.random() * 20));
		if (randomNumber >= 19) {randomStatus();}
	}

	// help function when mentioned and asked 'help'
	if (message.content.includes(client.user.id) && message.content.includes('help')) {client.commands.get('help').execute(message);}

	// checks if contains bot's prefix and executes accordingly
	if (!message.content.startsWith(prefix)) {
		// checks if a user was mentioned (not a command) along with '++' for the rep system
		if (message.content.endsWith('++') === true && message.channel.type == 'text') {
			// determines if someone was @ or guess is needed
			if (message.mentions.users.first() != undefined) {repFind(message, message.mentions.users.first());}
			else {findUser(message);}
		}
	}

	else {
	// splits off prefix and makes following text into lowercase
		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		// finds command and aliases from list
		const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		if (!command) return message.channel.send('That\'s not a command I recognize.').then(sentMessage => sentMessage.delete({ timeout: 5000 }));
		if (message.author.bot) return;

		// checks if command is server-only via command property
		if (command.guildOnly && message.channel.type !== 'text') {
			return message.reply('Sorry, that\'s a server only command.');
		}
		// checks if command is locked to dev use
		if (message.author.id != owner && command.devOnly == true) {
			return	message.reply('you do not have permission to execute this command (devOnly).');
		}

		// looks for arguments if needed
		if (command.args && !args.length) {
			let reply = `${message.author.username}: You didn't provide any arguments.`;
			// provides proper usage
			if (command.usage) {reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;}
			return message.channel.send(reply);
		}

		// cooldown timer for command usage (anti-spam)
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

		try {command.execute(message, args, client, timeDB);}
		catch (error) {
			console.error(error);
			message.channel.send('There was an error trying to execute that command.');
			message.channel.send(error).catch(console.error);
		}
	}
});


// randomly sets status based on RNG
function randomStatus() {
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

// matches text to a member in the guild, if applicable (so @ becomes optional)
function findUser(message) {
	let toMatch = message.content.split(' ', 2);
	if (toMatch[1] != undefined) {
		const first = toMatch[0].replace('++', '');
		const second = toMatch[1].replace('++', '');
		toMatch = `${first} ${second}`;
	}
	else {toMatch = toMatch[0].replace('++', '');}
	const userRegex = new RegExp(`(${toMatch})`, 'g');
	let matchFound = false;
	// fetches all members and checks each if there's a match
	message.guild.members.fetch()
		.then(members => {
			members.forEach(member => {
				// will not look for a match if one was already found, that way searches are in order as looped
				if (!matchFound) {
				// checks if user data array has nickname to avoid errors
					if (member.nickname != null) {
						if (member.user.username.match(userRegex)) {
							matchFound = true; return repFind(message, member.user);
						}
						else if (member.nickname.match(userRegex)) {
							matchFound = true; return repFind(message, member.user, member.nickname);
						}
					}
					else if (member.user.username.match(userRegex)) {
						matchFound = true; return repFind(message, member.user);
					}
				}
			});
		},
		)
		.catch(error => console.log(error));
}


// finds and adds reputation in the database when conditions met
function repFind(message, user, nickname) {
	let name;
	if (nickname != undefined) {name = nickname;}
	else {name = user.username;}
	// console.log(`repFind: Given ID was ${message.mentions.users.first()}`);
	const userToRepInfo = user;
	if (message.author.id === userToRepInfo.id) {return message.channel.send(`${name}: You cannot give yourself points.`);}
	// searches the db for the user mentioned
	repDB.find({ _id: userToRepInfo.id }, function(err, docs) {
		// error catch w/ initial find function
		if (err != null) {console.log(`DB ERROR: Could not search successfully: ${err}`);}
		// if no matches, create an entry in the db
		if (docs[0] === undefined) {
			console.log('Failure to find a matching ID, creating a new entry...');
			repDB.insert([{ _id: userToRepInfo.id, points: 0, name: userToRepInfo.username }], function(err) {
				// error catch with entry attempt
				if (err != null) {console.log(`DB ERROR: Failed to make new entry. '${err}'`);}
				// if the new entry was successfully created, rerun the function so a point will be added
				else {repFind(message, user, nickname);}
			});
		}
		// if a match was found, add a point
		else if (docs[0] != undefined) {repAdd(message, docs, userToRepInfo, name);}
	});
}

function repAdd(message, docs, userToRepInfo, name) {
	// adds one point to the existing for the first match (since its a uuid, only one should exist)
	// console.log(`repAdd: Adding one point to ${userToRepInfo.id}...`);
	const newPoints = docs[0].points + 1;
	repDB.update({ _id: userToRepInfo.id }, { _id: userToRepInfo.id, points: newPoints, name: userToRepInfo.username }, {}, function(err) {
		// error catch if adding points fails
		if (err != null) {
			message.channel.send('There was an error adding a point to the user.');
			console.log(`DB ERROR: Failed to update existing entry. '${err}'`);
		}
		else {return message.channel.send(`${name} now has ${newPoints} point(s).`);}
	});
}

// reminder functions to recover any that were sent after process exit, then waiting for them to timeout before sending it
async function reminderCheck() {
	const timeNow = Date.now();
	timeDB.find({ time: { $gte: timeNow - 2 } }, function(err, docs) {
		// error catch
		if (err != null) {return console.log(`DB ERROR: Failed to search for reminders on launch. '${err}'`);}
		// repeats the function for each match found, setting a timer
		if (docs[0] != undefined) {
			docs.forEach(function(entry) {
				const reminderTimeout = entry.time - timeNow;
				let remindDate = new Date(entry.time);
				remindDate = remindDate.toUTCString();
				console.log(`A reminder for ${remindDate} was scheduled, recovered from a previous instance.`);
				setTimeout(function() {
					const reminderToSend = `<@!${entry.userID}>: Reminder – ${entry.text}`;
					const channel = client.channels.cache.get(entry.channelID);
					channel.send(reminderToSend);
					// removes the reminder from the database, so a match isn't found again
					timeDB.remove({ _id: entry._id }, {}, function(err) {
						if (err != null) {console.log(`DB ERROR: Failed to remove sent reminder. '${err}'`);}
					});
				}, reminderTimeout);
			});
		}
		else {console.log('No reminders were scheduled.');}
	});
}


// login to Discord with your app's token
client.login(token);
