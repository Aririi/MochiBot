function findUser(message, args, argCheck) {
	let toMatch = args.join(' '); toMatch = toMatch.split(' ', 2);
	if (toMatch[1] != undefined) {toMatch = `${toMatch[0]} ${toMatch[1]}`;}
	else {toMatch = toMatch[0];}
	const userRegex = new RegExp(`(${toMatch})`, 'g'); let matchFound = false;
	// fetches all members and checks each if there's a match
	message.guild.members.fetch().then(members => {
		members.forEach(member => {
		// will not look for a match if one was already found, that way searches are in order as looped
			if (!matchFound) {
				if (member.user.username.match(userRegex)) {matchFound = true; return argCheck(member.user.id);}
			}
		});
	},
	).catch(error => console.error(error));
}

module.exports = {
	name: 'lastseen',
	description: 'Fetches when a user was last seen, according to logs. Note: The time may not be accurate, and all information is from when it was last updated. If a user leaves all guilds the bot is on, they are no longer visible to it.',
	usage: '<username/ID>',
	execute(message, args, a, b, presenceDB) {
		function argCheck(given) {
			if (typeof given === 'object' && message.channel.type != 'dm' && isNaN(given[0])) {return findUser(message, args, argCheck);}
			else if (typeof given === 'object' && message.channel.type === 'dm') {
				const regex = new RegExp(given[0]);
				presenceDB.find({ tag: regex }, function(err, docs) {
					if (err) {return console.error(err);}
					if (docs[0] != undefined) {return argCheck(docs[0]._id);}
					else {return message.channel.send('Sorry, I don\'t have any information on the user provided.');}
				});
			}
			// if ID given, look for their status info
			else if (typeof given === 'number' || !isNaN(given[0])) {
				let id;
				if (typeof given === 'object') {id = given[0];}
				else {id = given;}
				presenceDB.find({ _id: id }, function(err, docs) {
					if (err) {return console.error(err);}
					if (docs[0] != undefined) {return sendInfo(docs, id);}
					else if (message.channel.type != 'dm') {
						message.guild.members.fetch(id).then(user => {
							let status = 'I don\'t have any presence history for them, but I can see they are currently ';
							switch (user.presence.status) {
							case 'online': status += 'online.'; break;
							case 'idle': status += 'idle.'; break;
							case 'dnd': status += 'on Do Not Disturb.'; break;
							case 'offline': status += 'offline or invisible.'; break;
							}
							return message.channel.send(`${message.author.username}: ${status}`);
						});
					}
					else {return message.channel.send('Sorry, I don\'t have any information on the user provided.');}
				});
			}
			else {return message.channel.send('Sorry, I don\'t have any information on the user provided.');}
		}
		argCheck(args);

		function sendInfo(docs) {
			const user = docs[0]; let time = new Date(user.time); time = time.toUTCString();
			let days = 0; let hours = 0; let minutes = 0;
			let timeAgo = '';
			days = (Date.now() - user.time) / (1000 * 60 * 60 * 24); days = Math.round(days);
			if (days > 1) {timeAgo = `${Math.round(days)}d`; hours = (days % 1) / 24;}
			if (hours > 1) {
				timeAgo += `${Math.round(hours)}h`; minutes = (hours % 1); timeAgo += `${Math.round(minutes)}m`;
			}
			else {minutes = (Date.now() - user.time) / (1000 * 60); timeAgo = `${Math.round(minutes)}m`;}
			let status = `**${user.tag}** was last seen `; if (message.channel.type != 'dm') {status = `${message.author.username}: **${user.tag}** was last seen `;}
			switch (user.status) {
			case 'online': status += 'as online'; break;
			case 'idle': status += 'being idle.'; break;
			case 'dnd': status += 'on Do Not Disturb.'; break;
			case 'offline': status += 'as offline'; break;
			}
			status += ` about ${timeAgo} ago (${time}) on ${user.server}.`;
			if (isNaN(args[0])) {status += ` Their ID is \`${user._id}\``;}
			message.channel.send(status);
		}
	},
};
