module.exports = {
	name: 'rep',
	execute(repDB, message, user, nickname) {
		let name;
		// let operation; let amount = 1;
		// const args = message.content.split();
		// if (args[1] === '++' || args[1] === '--') {
		// 	if (isNaN(args[2])) {amount = args[2];}
		// }
		// else if (isNaN(args[1])) {amount = args[1];}
		// if (message.content.contains('++')) {operation = '+';}
		// if (message.content.contains('--')) {operation = '-';}
		function repFind() {
			if (nickname != undefined) {name = `**${nickname}** (a.k.a. ${user.tag})`;}
			else {name = `**${user.username}**`;}
			if (message.author.id === user.id) {return message.channel.send(`${user.username}: You cannot give yourself points.`);}
			// searches the db for the user mentioned
			repDB.find({ _id: user.id }, function(err, docs) {
				if (err) {return console.error(`DB ERROR: Could not search successfully.: ${err}`);}
				// if no matches, create an entry in the db
				if (docs[0] === undefined) {
					repDB.insert([{ _id: user.id, points: 0, name: user.username }], function(err) {
						if (err) {return console.error('DB ERROR: Failed to make new entry.', err);}
						// if the new entry was successfully created, rerun the function so a point will be added
						repFind();
					});
				}
				// if a match was found, add a point
				else if (docs[0] != undefined) {repModify(docs);}
			});
		}

		function repModify(docs) {
			// modifies the existing for the first match (since its a uuid, only one should exist)
			const newPoints = docs[0].points + 1;
			// const newPoints = `${docs[0].points} ${operation} ${amount}`; console.log(repModify);
			repDB.update({ _id: user.id }, { _id: user.id, points: newPoints, name: user.username }, {}, function(err) {
				if (err) {console.error(err);}
				else {return message.channel.send(`${name} now has ${newPoints} point(s).`);}
			});
		}
		repFind();
	},
};
