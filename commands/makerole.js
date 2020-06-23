const { prefix } = require('../config.json');
module.exports = {
	name: 'makerole',
	description: 'Makes a role with provided color and name.',
	cooldown: 5,
	aliases: ['make-role'],
	guildOnly: [true],
	usage: '[#hexColor] [name-phrase]',
	execute(message, args) {
		const regex = new RegExp(`^${prefix}makerole|${prefix}make-role`, 'gi');
		let roleName = message.content.replace(regex, '');
		roleName = roleName.slice(9, 50);
		const roleColor = args[0];
		console.log(`Making role with ${roleColor}; ${roleName};}`);

		if (message.member.hasPermission('MANAGE_ROLES') == true) {
			if (roleName == '') {
				return message.reply(`you did not give the needed arguments. (Use \`${prefix}help makerole\` for more information.)`);
			}
			if (roleColor == undefined) {
				return message.reply(`you did not give the needed arguments. (Use \`${prefix}help makerole\` for more information.)`);
			}
			else {
				message.guild.roles.create({ data: { name: roleName, permissions: [], color: roleColor,
					hoist: true, mentionable: false } }).catch(console.error);
				//   .then(error => {
				// 	message.reply(`there was an error: ${error}`);
				// },
				// );
			}
		}
		else {
			return message.reply('you need the \'Manage Roles\' permission for this command.');
		}
		message.reply(`Made role with color ${roleColor} and name "${roleName}"`);
	},
};
