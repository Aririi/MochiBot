const { prefix } = require('../config.json');
module.exports = {
	name: 'makerole',
	description: 'Makes a role with provided color and name.',
	cooldown: 10,
	aliases: ['createrole'],
	guildOnly: true,
	usage: '[#hexColor] [name]',
	args: true,
	execute(message, args) {
		const roleColor = args[0].replace('#', '');
		let roleName = args.shift();
		roleName = args.join(' ');
		if (args[0] === undefined) {return message.channel.send(`${message.author.username}: You did not provide a name for the role. (Use \`${prefix}help makerole\` for more information.)`);}
		console.log(`MGMT: Attmepting to make role with color '${roleColor}' and name '${roleName}'`);
		// checks for valid permissions
		if (message.member.hasPermission('MANAGE_ROLES') == true) {
			message.guild.roles.create({ data: { name: roleName, permissions: [], color: roleColor,
				hoist: true, mentionable: false } })
				.then(function() {message.channel.send(`${message.author.username}: Successfully made role with color ${roleColor} and name "${roleName}"`);})
				.catch(error => {
					message.channel.send('There was an error trying to make a role. (Try checking permissions.)');
					throw error;
				});
		}
		else {return message.reply('you need the \'Manage Roles\' permission for this command.');}
	},
};
