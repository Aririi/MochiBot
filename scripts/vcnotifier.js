/*
Notification types: Keywords, channel member count, message from user, member in/out channel.
Time delays optional, default to 5 minutes between same notifs
Needs to compare time since notification sent and look for changes in member list

Upon update, log members in DB
Get last doc containg the relevant vcs info, if an ID that someone has a notif for has joined/left, send a notification to them, then log that a notification has been sent
*/
/* the above will be future functionality, due to a discovered inconsistency with voice channel updates. For now, a reminder can be made for vcs, given a certain count. */
const moment = require('moment');
const { timezone } = require('../config.json');

module.exports = {
	name: 'vcnotifier',
	execute(state, vcDB, notifDB, client) {
		let time = moment(Date.now()).format('LLLL'); time += ` (${timezone})`;
		const presentMembers = [];
		if (!state.channel) {presentMembers.push('one-member');}
		else {
			state.channel.members.forEach(member => {
				if (!member.bot) {presentMembers.push(member.user.id);}
			});
		}
		notifDB.find({ vc: state.channelID }, function(err, docs) {
			if (err) {return console.log(err);}
			if (docs[0] === undefined) {return;}
			else {vcNotif(docs, presentMembers.length);}
		});

		function vcNotif(docs, present) {
			// if member count = to notification desired, send them a DM
			docs.forEach(doc => {
				if (present == doc.count) {
					const user = client.users.cache.get(doc.ID);
					user.send(`Notification – There are ${presentMembers.length} member(s) in "${state.channel.name}" as of ${time}.`);
				}
			});
		}


		/* future functionality
		// fetches last log related to the given ID for comparison, if none found, exit so it is just logged
		vcDB.find({ channel: state.channelID }, function(err, docs) {
			if (err) {return console.error(err);}
			if (docs[0] === undefined) {return;}
			else {compareInfo(docs.pop());}
		});

		// logs just updated vc info for comparison and later retrieval
		state.channel.members.forEach(member => presentMembers.push(member.user.id));
		console.log(state.channelID, state.guild.id, state.channel.name, presentMembers);
		const docInsert = { channel: state.channelID, guild: state.guild.id, name: state.channel.name, users: presentMembers, count: presentMembers.length };
		vcDB.insert(docInsert, function(err) {if (err) {return console.error(err);}});


		function compareInfo(prev) {
			console.log(prev);
		}
		*/

	},
};
