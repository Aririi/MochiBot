const fetch = require('node-fetch');
const moment = require('moment'); const numeral = require('numeral');
const { googleAPIKey } = require('../config.json');

module.exports = {
	name: 'yt-info',
	execute(message) {
		// will not send info if in a bot or music channel, as some bots delete the original message and may lead to unwanted spam
		if (message.channel.type != 'dm') {if (message.channel.name.includes('bot') || message.channel.name.includes('music')) {return;}}
		const regex = /(?:youtube\.com\/(?:[^/]+\/.\/|(?:v|e(?:mbed)?)\/|.*?[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/gi;
		const str = message.content; let m; const ids = [];

		async function getInfo(id) {
			const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}&key=${googleAPIKey}`;
			const info = await fetch(url).then(response => response.json()).catch(error => console.error(error));
			const publishedAt = moment(info.items[0].snippet.publishedAt).format('L');
			let length = info.items[0].contentDetails.duration; length = length.replace('PT', '');
			length = length.replace('H', 'h'); length = length.replace('M', 'm'); length = length.replace('S', 's');
			const views = numeral(info.items[0].statistics.viewCount).format('0,0'); const comments = numeral(info.items[0].statistics.commentCount).format('0,0');
			const likes = numeral(info.items[0].statistics.likeCount).format('0,0'); const dislikes = numeral(info.items[0].statistics.dislikeCount).format('0,0');
			const text = `**${info.items[0].snippet.title}** | by ${info.items[0].snippet.channelTitle} | Views: ${views}, Likes: ${likes}, Dislikes: ${dislikes}, Comments: ${comments} | Published: ${publishedAt} | Length: ${length}`;
			message.channel.send(text);
		}

		// returns each video id (11 char long), snippet from regex101
		while ((m = regex.exec(str)) !== null) {
			if (m.index === regex.lastIndex) {regex.lastIndex++;}
			m.forEach(match => {if (match.length === 11) {return ids.push(match);}});
		}
		if (ids[0] === undefined) {return console.log('No video IDs.');}
		ids.forEach(id => getInfo(id));
	},
};
