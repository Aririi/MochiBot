const translate = require('translate');
const { translateKey } = require('../config.json');
translate.engine = 'google';
translate.key = translateKey;
const supportedISOs = [
	'af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg',
	'ca', 'ceb', 'zh', 'zh-CN', 'zh-TW', 'co', 'hr', 'cs', 'da', 'nl',
	'en', 'eo', 'et', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu',
	'ht', 'ha', 'haw', 'he', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id',
	'ga', 'it', 'ja', 'jv', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky',
	'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi',
	'mr', 'mn', 'my', 'ne', 'no', 'ny', 'or', 'ps', 'fa', 'pl', 'pt',
	'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk',
	'sl', 'so', 'es', 'su', 'sw', 'sv', 'tl', 'tg', 'ta', 'tt', 'te',
	'th', 'tr', 'tk', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu',
];
module.exports = {
	name: 'translate',
	description: 'Translates the given words from one language to another. Put the || around the command and result deleted in 15 seconds. (WIP)',
	cooldown: 3,
	usage: '<initial lang.] [final lang.] [stuff to translate>',
	execute(message, args) {
    message.channel.send('This command is a work in progress.')
		// let firstLang = null;
		// let secondLang = null;
		// let validTranslate = null;
		// let translateToISO = null;
		// // checks if the first and second word is a language ISO
		// if (supportedISOs.includes(args[0]) === true) {
		// 	firstLang = args[0];
		// 	validTranslate = true;
		// }
		// else {firstLang = null; validTranslate = false;}
		// if (supportedISOs.includes(args[1]) === true) {
		// 	secondLang = args[1];
		// }
		// else {translateToISO = firstLang; }
    //
		// // if two ISOs were given, translate the provided with 'from' and 'to'
		// if (validTranslate === true && translateToISO === null) {
		// 	let textToTranslate = args.shift();
		// 	textToTranslate = args.shift();
		// 	textToTranslate = args.join(' ');
		// 	translate(textToTranslate, { from: firstLang, to: secondLang }).then(result => {message.channel.send(`Translation: ${result}`);});
		// }
	},
};
