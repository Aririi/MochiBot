const nekoLifeClient = require('nekos.life');
const nekolife = new nekoLifeClient;

module.exports = {
	name: 'owo',
	description: '',
	aliases: ['owoify', 'owospeak'],
	usage: '<sentence>',
	args: true,
	execute(message, args) {
		const toOwo = args.join(' ');
		async function owoify() {
			const owod = await nekolife.sfw.OwOify({ text:toOwo });
			return owod;
		}
		owoify().then(owod => message.channel.send(owod.owo));
	},
};
