const { prefix } = require('../config.json');
// member id length is 18 characters
// WIP
module.exports = {
	name: 'addrole',
	description: 'Makes a role with provided color and name. (experimental, needs rework)',
	cooldown: 5,
	aliases: ['applyrole'],
	guildOnly: [true],
	usage: '[mentioned user] [role]',
	args: true,
	execute(message) {
		const regex = new RegExp(`^${prefix}addrole|${prefix}add-role`, 'gi');
		let roleName = message.content.replace(regex, '');
		roleName = roleName.slice(24, 66);
		// removes user id from string
		// const role = message.guild.roles.find(role => role.name === roleName);
		const member = message.mentions.members.first();
		console.log(`MGMT: Adding $[{role}] to $[]{userToAddRoleTo}, provided role was: ${roleName}`);
		if (message.member.hasPermission('MANAGE_ROLES') == true) {
			// if (role == true) {
			member.addrole(roleName).catch(console.error);
			// }
		}
		else {
			return message.reply('you need the \'Manage Roles\' permission for this command.');
		}
		// message.reply(`Made role with color ${roleColor} and name "${roleName}"`);
	},
};
