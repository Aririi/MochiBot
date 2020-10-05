const moment = require('moment');
const { timezone } = require('../config.json');

function findUser(message, args, checkID) {
	let toMatch = args.join(' '); toMatch = toMatch.split(' ', 2);
	if (toMatch[1] != undefined) {toMatch = `${toMatch[0]} ${toMatch[1]}`;}
	else {toMatch = toMatch[0];}
	const userRegex = new RegExp(`(${toMatch})`, 'g'); let matchFound = false;
	// fetches all members and checks each if there's a match
	message.guild.members.fetch().then(members => {
		members.forEach(member => {
			if (matchFound) {return;}
			if (member.user.username.match(userRegex)) {matchFound = true; return checkID(member.user.id);}
		});
		if (!matchFound) {return message.channel.send(`${message.author.username}: Couldn't find a user with that username.`);}
	},
	).catch(error => console.error(error));
}

module.exports = {
	name: 'lastseen',
	description: 'Fetches when a user was last seen, according to logs. Note: The time may not be accurate, as all information is from when it was last updated from a guild. If a user leaves all guilds the bot is on, they are no longer visible to it.',
	usage: '<username/id>',
	args: true,
	execute(message, args, a, b, presenceDB) {
		argCheck(args);
		function argCheck(given) {
			if (message.channel.type != 'dm' && isNaN(given[0])) {return findUser(message, args, checkID);}
			else if (message.channel.type != 'dm' && !isNaN(given[0])) {checkID(given[0]);}
			else if (message.channel.type === 'dm' && isNaN(given[0])) {return checkUser(given[0]);}
			else if (message.channel.type === 'dm' && !isNaN(given[0])) {checkID(given[0], 'dm');}
			else {return message.channel.send('You must provide an ID or username.');}
		}

		function checkID(id, type) {
			if (type === 'dm') {
				presenceDB.find({ _id: id }, function(err, docs) {
					if (err) {return console.error(err);}
					if (docs[0] != undefined) {return sendInfo(docs[0]);}
					else {return message.channel.send('Sorry, I don\'t have any information on the user provided.');}
				});
			}
			else {
				presenceDB.find({ _id: id }, function(err, docs) {
					if (err) {return console.error(err);}
					if (docs[0] != undefined) {return sendInfo(docs[0]);}
					else {
						message.guild.members.fetch(id).then(user => {
							let status = 'I don\'t have any presence history for them, but I can see they are currently ';
							switch (user.presence.status) {
							case 'online': status += 'online.'; break;
							case 'idle': status += 'idle.'; break;
							case 'dnd': status += 'on Do Not Disturb.'; break;
							case 'offline': status += 'offline or invisible.'; break;
							}
							return message.channel.send(`${message.author.username}: ${status}`);
						}).catch(error => {
							if (error.message === 'Unknown User') {return message.channel.send(`${message.author.username}: I couldn't find a user with that ID.`);}
							else {return console.error(error);}
						});
					}
				});
			}
		}

		function checkUser(name) {
			const regex = new RegExp(name, 'gi');
			presenceDB.find({ tag: { $regex: regex } }, function(err, docs) {
				if (err) {return console.error(err);}
				if (docs[0] != undefined) {return sendInfo(docs[0]);}
				else {return message.channel.send('Sorry, I don\'t have any information on the user provided.');}
			});
		}

		function sendInfo(user) {
			let time = moment(user.time).format('MMMM Do YYYY, h:mm:ss'); time += ` ${timezone}`;
			let days = 0; let hours = 0; let minutes = 0;
			let timeAgo = '';
			minutes = (Date.now() - user.time) / (1000 * 60); timeAgo = `${Math.round(minutes)}m`;
			if (minutes >= 60) {
				hours = minutes / 60; minutes = Math.round((hours % 1) * 60); hours = Math.round(hours);
				timeAgo = `${hours}h${minutes}m`;
			}
			if (hours >= 72) {
				days = hours / 24; hours = Math.round((days % 1) * 24); days = Math.round(days);
				timeAgo = `${days}d${hours}h${minutes}m`;
			}
			let status = `**${user.tag}** was last seen `;
			if (message.channel.type != 'dm') {status = `${message.author.username}: ` + status;}
			switch (user.status) {
			case 'online': status += 'online'; break;
			case 'idle': status += 'idling'; break;
			case 'dnd': status += 'on Do Not Disturb.'; break;
			case 'offline': status += 'as offline'; break;
			}
			status += ` about ${timeAgo} ago (${time}) on ${user.server}.`;
			if (isNaN(args[0])) {status += ` (ID: \`${user._id}\`)`;}
			message.channel.send(status);
		}
	},
};
