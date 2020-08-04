// require the discord.js module and config
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, owner } = require('./config.json');
const Datastore = require('nedb');
const repDB = new Datastore({ filename: './databases/rep.db' });
repDB.loadDatabase(function(err) {
	if (err) {return console.error(err);}
	else {return;}
});
const timeDB = new Datastore({ filename: './databases/reminders.db' });
timeDB.loadDatabase(function(err) {
	if (err) {return console.error(err);}
	else {return;}
});
const presenceDB = new Datastore({ filename: './databases/presence.db' });
presenceDB.loadDatabase(function(err) {
	if (err) {return console.error(err);}
	else {return;}
});
const client = new Discord.Client();
// TO DO library/file for possible statuses — const { readyUserActivity } = require('./commands/randomstatus.js');

// commands collection
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

// scripts collection
client.scripts = new Discord.Collection();
const scriptFiles = fs.readdirSync('./scripts').filter(file => file.endsWith('.js'));
for (const file of scriptFiles) {
	const script = require(`./scripts/${file}`);
	client.scripts.set(script.name, script);
}
const rep = client.scripts.get('rep');
async function presenceUpdate(presence, tag) {
	await client.scripts.get('presence').execute(presenceDB, presence, tag);
}

// when the client is ready, run this code
client.once('ready', () => {
	console.log(`User Tag: ${client.user.tag}\nUser ID: ${client.user.id}\n${client.user.username} is ready for action! :3`);
	client.scripts.get('randomstatus').execute(client); client.scripts.get('reminder').execute(client, timeDB);
	// fetches the presences of every member on every connected guild and stores it
	client.guilds.cache.forEach(guild => guild.members.fetch().then(members => members.forEach(member => {presenceUpdate(member.presence, member.user.tag);})));
});

// initial launch and connection issue handles
client.on('shardError', error => {console.error('A websocket connection encountered an error:', error);});
process.on('unhandledRejection', error => {console.error('Unhandled promise rejection:', error);});

// status logging for lastseen and notify commands
client.on('presenceUpdate', function(oldPresence, newPresence) {
	newPresence.guild.members.fetch(newPresence.userID).then(member => presenceUpdate(newPresence, member.user.tag));
});
client.on('guildMemberAdd', member => {presenceUpdate(member.presence, member.user.tag);});


// command section
client.on('message', message => {
	console.log(`-[${message.author.tag}: ${message.content}]-`);

	// random chance to change the status, unless the command is one of those blacklisted below
	if (!message.content.includes(['setstatus', 'setpresence', 'setactivity', 'randomstatus', 'shufflestatus', 'restart'])) {
		const randomNumber = (Math.floor(Math.random() * 20));
		if (randomNumber >= 19) {client.scripts.get('randomstatus').execute(client);}
	}

	// help function when mentioned and asked 'help'
	if (message.content.includes(client.user.id) && message.content.includes('help')) {client.commands.get('help').execute(message);}
	// checks if contains bot's prefix and executes accordingly
	if (!message.content.startsWith(prefix)) {
		if (message.content.endsWith('++') === true && message.channel.type == 'text') {
			// determines if someone was @ or guess is needed
			// TO DO: Implement regex for getting the mentioned user
			if (message.mentions.users.first() != undefined) {rep.execute(repDB, message, message.mentions.users.first());}
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
		if (command.guildOnly && message.channel.type !== 'text') {return message.reply('Sorry, that\'s a server only command.');}
		// checks if command is locked to dev use
		if (message.author.id != owner && command.devOnly == true) {return message.reply('you do not have permission to execute this command (devOnly).'); }

		// looks for arguments if needed
		if (command.args && !args.length) {
			let reply = `${message.author.username}: You didn't provide any arguments.`;
			// provides proper usage
			if (command.usage) {reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;}
			return message.channel.send(reply);
		}

		// cooldown timer for command usage (anti-spam)
		if (!cooldowns.has(command.name)) {cooldowns.set(command.name, new Discord.Collection());}
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

		try {command.execute(message, args, client, timeDB, presenceDB);}
		catch (error) {console.error(error); message.channel.send('There was an error trying to execute that command.');}
	}
});

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
						if (member.user.username.match(userRegex)) { matchFound = true; return rep.execute(repDB, message, member.user); }
						else if (member.nickname.match(userRegex)) { matchFound = true; return rep.execute(repDB, message, member.user, member.nickname); }
					}
					else if (member.user.username.match(userRegex)) { matchFound = true; return rep.execute(repDB, message, member.user); }
				}
			});
		},
		)
		.catch(error => console.log(error));
}



// login to Discord with your app's token
client.login(token);
