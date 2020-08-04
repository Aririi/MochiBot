module.exports = {
	name: 'presence',
	execute(presenceDB, newPresence, tag) {
		let time = Date.now();
		if (newPresence.activities[1] != undefined && newPresence.status != 'offline') {
			if (newPresence.activities[1].createdTimestamp < newPresence.activities[0].createdTimestamp) {time = newPresence.activities[1].createdTimestamp;}
			else {time = newPresence.activities[0].createdTimestamp;}
		}
		const presence = { _id: newPresence.userID, tag: tag, time: time, server: newPresence.guild.name, status: newPresence.status, clientstatus: newPresence.clientStatus, activities: newPresence.activities };
		presenceDB.find({ _id: newPresence.userID }, function(err, docs) {
			if (err) {return console.error(err);}
			// if match, update it, else insert new
			if (docs[0] != undefined) {
				// if the statuses are the same, and it was logged earlier, leave the time as is
				if (docs[0].time < time && docs[0].status === presence.status) {presence.time = docs[0].time;}
				presenceDB.update({ _id: newPresence.userID }, presence, {}, function(err) {
					if (err) {return console.error(err);}
				});
			}
			else {presenceDB.insert(presence, function(err) {if (err) {return console.error(err);}});}
		});
		return;
	},
};
