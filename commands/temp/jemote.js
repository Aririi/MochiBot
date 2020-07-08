module.exports = {
	name: 'jemote',
	description: 'Sends the corresponding emote name from https://japaneseemoticons.me/',
	cooldown: 1,
	usage: '[]',
	execute(message, args) {
		if (args[0] === 'excited-1') {
			message.channel.send('`(((o(ﾟ▽ﾟ)o)))`');
		}
		else if (args[0] === 'excited-2') {
			message.channel.send('`o((*^▽^*))o`');
		}
		else if (args[0] === 'excited-3') {
			message.channel.send('`Ｏ(≧▽≦)Ｏ`');
		}
		else if (args[0] === 'excited-4') {
			message.channel.send('`o(〃＾▽＾〃)o`');
		}
		else if (args[0] === 'excited-5') {
			message.channel.send('`o(≧∇≦o)`');
		}
		else if (args[0] === 'excited-6') {
			message.channel.send('`σ(≧ε≦ｏ)`');
		}
		else if (args[0] === 'excited-7') {
			message.channel.send('`《《o(≧◇≦)o》》`');
		}
		else if (args[0] === 'excited-8') {
			message.channel.send('`o(*>ω<*)o`');
		}

	},
};
