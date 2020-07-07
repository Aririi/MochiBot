module.exports = {
	name: 'compact',
	description: 'Compacts a database manually if needed. (devOnly)',
	aliases: ['condense'],
	usage: '[db name]',
	devOnly: true,
	execute(message, args) {
		const Datastore = require('nedb');
		if (args[0] === 'rep') {
			const repDB = new Datastore({ filename: './databases/rep.db', autoload: true });
			repDB.persistence.compactDatafile();
			message.channel.send('Compaction of rep.db attempted.');
			console.log(`DB ACTION: ${message.author.id} compacted rep.db`);
		}
	},
};
