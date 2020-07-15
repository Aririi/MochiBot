const Datastore = require('nedb');
const timeDB = new Datastore({ filename: './databases/reminders.db', autoload: true });

module.exports = {
	name: 'remindme',
	description: 'Reminds you you with a message, given a certain time after sending it.',
	aliases: ['reminder', 'setreminder', 'set-reminder'],
	usage: '[time (ddhhmm)] [what to be reminded of]',
	execute(message, args, client) {
		// gets current time to compare for later
		let timeNow = Date.now();
		const timeRegex = /d|h|m/g;
		const firstArg = args[0].toLowerCase();

		// if the first arg contains d, h, or m, then split it apart; otherwise say its invalid
		if (firstArg.search(timeRegex) != -1) {
			let dLocation = undefined;
			let hSpliceStart = undefined;	let hLocation = undefined;
			let mSpliceStart = undefined;	let mLocation = undefined;
			let days = 0;
			let hours = 0;
			let minutes = 0;

			// check if day given, then store it
			if (firstArg.includes('d') === true) {
				dLocation = firstArg.search('d');
				days = firstArg.slice(0, dLocation);
				if (days > 365 * 2) {return message.channel.send('Sorry, reminders can only go up to two years from now.');}
			}
			else {dLocation = null;}
			// if there was a day (d) then change where to slice for m, else keep it 0
			if (dLocation != null) {hSpliceStart = dLocation + 1;}
			else {hSpliceStart = 0;}

			// checks for hours and stores
			if (firstArg.includes('h') === true) {
				hLocation = firstArg.search('h');
				hours = firstArg.slice(hSpliceStart, hLocation);
				if (hours > 365 * 2 * 24) {return message.channel.send('Sorry, reminders can only go up to two years from now.');}
			}
			else {hLocation = null;}
			// if there was hours (h) then change where to slice for m, else keep it 0
			if (hLocation != null) {mSpliceStart = hLocation + 1;}
			else {mSpliceStart = 0;}

			// check for minutes and store
			if (firstArg.includes('m') === true) {
				mLocation = firstArg.search('m');
				minutes = firstArg.slice(mSpliceStart, mLocation);
				if (minutes > 365 * 2 * 24 * 60) {return message.channel.send('Sorry, reminders can only go up to two years from now.');}
				if (minutes < 0.5) {return message.channel.send(`${message.author.username} seems to have a short memory...`);}
			}
			else {mLocation = null;}
			// console.log(days, hours, minutes);

			// converts the time into ms and adds them together
			days = days * 24 * 60 * 60 * 1000;
			hours = hours * 60 * 60 * 1000;
			minutes = minutes * 60 * 1000;
			const timeToAdd = days + hours + minutes;
			// adds the times together to get when to remind the user (rounds to nearest minute for simplicity later on)
			const timeToRemind = timeNow + timeToAdd;
			// console.log(timeNow, timeToAdd, timeToRemind)

			// adds the reminder to the database with time, ID, and message
			let reminderText = args.shift();
			reminderText = args.join(' ');
			let remindDate = new Date(timeToRemind);
			remindDate = remindDate.toUTCString();
			const reminder = { userID: message.author.id, channelID: message.channel.id, time: timeToRemind, text: reminderText };
			timeDB.insert(reminder, function(err) {
				// error catch with entry attempt
				if (err != null) {
					message.channel.send('There was an error creating that reminder.');
					console.log(`DB ERROR: Failed to make new reminder. '${err}'`);
				}
				else {
					message.channel.send(`${message.author.username}: I'll remind you about "${reminderText}" on ${remindDate}`);
					// console.log(timeToAdd);
					// since the reminder was successfully created, timeout until then, with room for rounding errors
					// This should eventually move to index, so reminders persist across restarts
					setTimeout(addTime, timeToAdd - 1);
				}
			});
		}
		else {return message.channel.send('Invalid time. See the usage for more info. (Example: 16d32h128m)');}

		// function to send reminder once timeout complete
		function addTime() {
			timeNow = Date.now() / 1000;
			timeNow = Math.round(timeNow);
			// looks for a matching reminder with time under within 2 seconds in case of rounding
			timeDB.find({ time: { $gte: timeNow - 2 } }, function(err, docs) {
				// error catch
				if (err != null) {
					message.channel.send('There was an error trying to find a reminder.');
					return console.log(`DB ERROR: Failed to search for reminder. '${err}'`);
				}
				// if a reminder was found for that time, send it in the channel it was created
				if (docs[0] != undefined) {
					const reminderToSend = `<@!${docs[0].userID}>: Reminder – ${docs[0].text}`;
					// changes the channel to send the message to whereever it was asked, this isn't needed at the moment,
					// but is future proofing for when the function is moved where channel isn't already defined
					const channel = client.channels.cache.get(docs[0].channelID);
					channel.send(reminderToSend);
					// removes the reminder from the database, so a match isn't found again
					timeDB.remove({ _id: docs[0]._id }, {}, function(err) {
						if (err != null) {
							message.channel.send('There was an error removing the sent reminder.');
							console.log(`DB ERROR: Failed to remove sent reminder. '${err}'`);
						}
					});
				}
			});
		}
	},
};
