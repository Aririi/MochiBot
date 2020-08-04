// reminder functions to recover any that were sent after process exit, then waiting for them to timeout before sending it
module.exports = {
	name: 'reminder',
	execute(client, timeDB) {
		const timeNow = Date.now();
		timeDB.find({ time: { $gte: timeNow - 2 } }, function(err, docs) {
			// error catch
			if (err) {return console.error(`DB ERROR: Failed to search for reminders on launch. '${err}'`);}
			// repeats the function for each match found, setting a timer
			if (docs[0] != undefined) {
				let count = 0;
				docs.forEach(function(entry) {
					const reminderTimeout = entry.time - timeNow;	count++;
					setTimeout(function() {
						const reminderToSend = `<@!${entry.userID}>: Reminder – ${entry.text}`;
						const channel = client.channels.cache.get(entry.channelID);
						channel.send(reminderToSend);
						// removes the reminder from the database, so a match isn't found again
						timeDB.remove({ _id: entry._id }, {}, function(err) {
							if (err) {console.error('DB ERROR: Failed to remove sent reminder.', err);}
						});
					}, reminderTimeout);
				});
				console.log(count, 'reminder(s) were recovered from a previous instance.');
			}
			else {console.log('No reminders were scheduled.');}
		});

	},
};
