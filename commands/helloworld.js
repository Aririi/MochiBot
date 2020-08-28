module.exports = {
	name: 'helloworld',
	description: 'Programming l33t joke.',
	aliases: ['hello', 'test'],
	execute(message) {message.channel.send('Hello world!');},
};
