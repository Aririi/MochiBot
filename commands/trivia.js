const fetch = require('node-fetch');
const Discord = require('discord.js');
const { name, triviaColor } = require('../config.json');
const Datastore = require('nedb');
// const triviaDB = new Datastore({ filename: './databases/trivia.db', autoload: true });
// triviaDB.onload(function(err) {if (err) {console.error(err);}});
const triviaDB = new Datastore({ filename: './databases/trivia.db' });
const fs = require('fs');

module.exports = {
	name: 'trivia',
	description: 'Gets a random trivia question from OpenTDB.',
	cooldown: 5,
	execute(message) {
		triviaDB.loadDatabase(function(err) {
			if (err) {return console.error(err);}
			else {return;}
		});

		let type; let difficulty; let attempts;
		let allAnswers = []; const incorrectAnswers = []; let correctNumber;
		let token;
		let buff; let base64;
		let index; let temp;
		let i = -1;	let match; let matchFound = false;
		let time;
		// get the session token, get a question with async,
		// then spit into an embed,
		// turn on a collecter for answer with timeout,
		// then if correct asnwer, add to db with difficulty

		// gets the token stored on last run, if none or invalid, will be fetched and stored for later use
		fs.readFile('./databases/trivia_token', (error, txtString) => {
			if (error) {console.log(error);}
			else {token = txtString.toString(); return getTrivia(token);}
		});

		// if token invalid (code 3 and 4), get new token and rerun triviaGet()
		async function getToken() {
			token = await fetch('https://opentdb.com/api_token.php?command=request')
				.then(response => response.json())
				.catch(error => console.error(error));
			token = token.token;
			fs.writeFile('./databases/trivia_token', token, (error) => {if (error) {console.error(error);} });
			getTrivia();
		}

		async function getTrivia() {
			// no token url: const trivia = await fetch('https://opentdb.com/api.php?amount=1&encode=base64')
			const trivia = await fetch(`https://opentdb.com/api.php?amount=1&token=${token}&encode=base64`)
				.then(response => response.json())
				.catch(error => console.error(error));
			switch(trivia.response_code) {
			case 0: sendTrivia(trivia.results[0]); break;
			case 1: message.channel.send('API reported code 1.'); break;
			case 2: message.channel.send('API reported code 2.'); break;
			case 3: getToken(); console.log('API: Retrieving new token.'); break;
			case 4: getToken(); console.log('API: No more questions. Retrieving new token.'); break;
			}
		}

		async function sendTrivia(trivia) {
			// converts the base64 response to utf8
			base64 = trivia.category; buff = Buffer.from(base64, 'base64');
			const category = buff.toString('utf-8');
			base64 = trivia.type; buff = Buffer.from(base64, 'base64');
			type = buff.toString('utf-8');
			base64 = trivia.difficulty; buff = Buffer.from(base64, 'base64');
			difficulty = buff.toString('utf-8');
			base64 = trivia.question; buff = Buffer.from(base64, 'base64');
			const question = buff.toString('utf-8');
			base64 = trivia.correct_answer; buff = Buffer.from(base64, 'base64');
			const correctAnswer = buff.toString('utf-8');
			trivia.incorrect_answers.forEach(answer => {
				base64 = answer; buff = Buffer.from(base64, 'base64');
				incorrectAnswers.push(buff.toString('utf-8'));
			});

			// conditional for question types so possibilities are treated correctly
			if (type === 'multiple') {
				// scrambles the answers for sending in the embed
				// TO DO: Write cyclic function to track the correct num, instead of hunting it down later
				incorrectAnswers.push(correctAnswer);
				allAnswers = incorrectAnswers;
				let counter = allAnswers.length - 1;
				while (counter > 0) {
					index = Math.floor(Math.random() * counter); counter--;
					temp = allAnswers[counter];
					allAnswers[counter] = allAnswers[index];
					allAnswers[index] = temp;
				}
				attempts = allAnswers.length - 1;

				// since the answers were shuffled, find the correct one and save it for later; TO DO: make redundant
				const regex = new RegExp(`(${correctAnswer})`);
				allAnswers.forEach(answer => {
					if (!matchFound) {
						i++; match = answer.match(regex);
						if (match) {correctNumber = i + 1; matchFound = true;}
					}
				});
				// changes array into Discord formatted string list for the embed
				allAnswers.forEach((item, x) => {
					if (x != 0) {
						allAnswers = `
          ${allAnswers}
          ${x + 1}. – **${item}**`;
					}
					else {allAnswers = `${x + 1}. – **${item}**`;}
				});
			}
			else if (type === 'boolean') {
				if (correctAnswer == 'True') {
					allAnswers = `
          1. – **${correctAnswer}**
          2. – **${incorrectAnswers[0]}**`;
					correctNumber = 1;
				}
				else if (correctAnswer == 'False') {
					allAnswers = `
          1. – **${incorrectAnswers[0]}**
          2. – **${correctAnswer}**`;
					correctNumber = 2;
				}
				incorrectAnswers.push(correctAnswer);
				attempts = incorrectAnswers.length - 1;
			}

			switch(difficulty) {
			case 'easy': difficulty = 'Easy'; break;
			case 'medium': difficulty = 'Medium'; break;
			case 'hard': difficulty = 'Hard'; break;
			}

			// console.log(correctAnswer, correctNumber);
			const triviaEmbed = new Discord.MessageEmbed()
				.setColor(triviaColor)
				// .setAuthor(`${name}'s Trivia Time`, `${message.author.displayAvatarURL({ dynamic:true })}?size=64`)
				.setAuthor(`${name}'s Trivia Time`, 'attachment://MochiBot-64.png')
				.attachFiles(['./media/MochiBot-64.png'])
				.setDescription(question)
				.addFields(
					{ name: 'Possibilities:', value: allAnswers, inline: false },
					{ name: 'Difficulty:', value: `\`${difficulty}\``, inline: true },
					{ name: 'Category:', value: `\`${category}\``, inline: true },
				)
				.setTimestamp()
				.setFooter(
					`${message.author.username}: You have 30 seconds and ${attempts} total attempt(s).`,
					`${message.author.displayAvatarURL({ dynamic:true })}?size=32`);
			await message.channel.send(triviaEmbed);
			message.channel.send('Others may answer after 10 seconds.')
				.then(sentMessage => {
					sentMessage.delete({ timeout: 10 * 1000 });
					time = 0; setTimeout(function() { time = 10; }, 10 * 1000);
				});

			// starts collector for messages, subtracting attempts as wrong answers are given
			const filter = m => !m.author.bot;
			const collector = message.channel.createMessageCollector(filter, { time: 30 * 1000 });
			let answered;
			collector.on('collect', m => {
				// once timeout completes, 10 seconds have passed, allowing others to answer
				if (time != 10 && m.author.id != message.author.id) {
					return message.channel.send(`${m.author.username}: Please wait before answering.`).then(sentMessage => sentMessage.delete({ timeout: 3000 }));
				}
				else if (time === 10 || m.author.id === message.author.id) {
					// one attempt is removed unless answer is correct; if no more attempts, exit the game
					if (!answered) {
						if (m.content.includes('cancel')) {message.channel.send('Recieved \'cancel\': Game terminated.'); return answered = true;}
						if (attempts >= 1 && (m.content.includes(correctAnswer) || m.content.includes(correctNumber))) {
							message.channel.send(`**${m.author.username}** has answered correctly!`); answered = true; triviaAdd(m);
						}
						else {attempts--;}
						if (!answered) {
							if (attempts >= 1 && !m.content.includes(correctAnswer) && !m.content.includes(correctNumber)) {
								message.channel.send(`${m.author.username}: Incorrect answer, there are ${attempts} attempt(s) remaining to get the correct one.`);
							}
							else if (attempts === 0 && !m.content.includes(correctAnswer) && !m.content.includes(correctNumber)) {
								message.channel.send(`All attempts used. Ending game.\nThe correct answer was "${correctAnswer}" (${correctNumber})`); return answered = true;
							}
							else {return message.channel.send(`Unexpected conditions. ${attempts} ${answered}`);}
						}
					}
					else {return;}
				}
				else {message.channel.send(`${m.author.username}: Please wait the whole ten seconds.`);}
			});
			setTimeout(function() {
				collector.stop();
				if (answered != true) { return message.channel.send(`Time has run out.\nThe correct answer was "${correctAnswer}" (${correctNumber})`);}
				else {return;}
			}, 30 * 1000);
		}

		function triviaAdd(m) {
			triviaDB.find({ _id: m.author.id }, function(err, docs) {
				if (err != null) {console.log(`DB ERROR: Could not search successfully: ${err}`);}
				// if no matches, create an entry in the db
				if (docs.length === 0) {
					console.log('Failure to find a matching ID, creating a new entry...');
					triviaDB.insert([{ _id: m.author.id, easy: 0, medium: 0, hard: 0, multiple: 0, boolean: 0, name: m.author.username }], function(err) {
						if (err != null) {console.log(`DB ERROR: Failed to make new entry. '${err}'`);}
						else {triviaAdd(m);}
					});
				}
				// if a match was found, add a tally to the total for the relevant difficulty
				else {
					let triviaUpdate;
					switch(difficulty && type) {
					case 'Easy' && 'multiple': triviaUpdate = { easy: docs[0].easy + 1, multiple: docs[0].multiple + 1, name: m.author.username }; break;
					case 'Easy' && 'boolean': triviaUpdate = { easy: docs[0].easy + 1, boolean: docs[0].boolean + 1, name: m.author.username }; break;
					case 'Medium' && 'multiple': triviaUpdate = { medium: docs[0].medium + 1, multiple: docs[0].multiple + 1, name: m.author.username }; break;
					case 'Medium' && 'boolean': triviaUpdate = { medium: docs[0].medium + 1, boolean: docs[0].boolean + 1, name: m.author.username }; break;
					case 'Hard' && 'multiple': triviaUpdate = { hard: docs[0].hard + 1, multiple: docs[0].multiple + 1, name: m.author.username }; break;
					case 'Hard' && 'boolean': triviaUpdate = { hard: docs[0].hard + 1, boolean: docs[0].boolean + 1, name: m.author.username }; break;
					}
					triviaDB.update({ _id: m.author.id }, triviaUpdate, {}, function(err) {
						// error catch if adding points fails
						if (err != null) { message.channel.send('There was an error adding a point to the user.'); console.log(`DB ERROR: Failed to update existing entry. '${err}'`); }
						else {return console.log(`DB: Success in adding 1 to ${difficulty} and ${type}`);}
					});
				}
			});
		}
	},
};
