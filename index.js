#!/usr/bin/env node
"use strict";
const readline = require('readline');
const rl = readline.createInterface(process.stdin, process.stdout);
const gulp = require('gulp');
var program = require('commander');

var fs = require('fs');
var stream;

var project_name = 'botany_default';

// ask for things to be added to .env
var questionsArray = [
  { 
    question: `What's your facebook page access token?\r\n> `,
    varName: `FB_ACCESS_TOKEN`
  },
  { 
    question: `What's your facebook verify token?\r\n> `,
    varName: `VERIFY_TOKEN`
  },
  { 
    question: `What's your LUIS URL?\r\n> `,
    varName: `LUIS_URI`
  },
  { 
    question: `What port do you want your server on? \r\n> `,
    varName: `PORT`
  }
]
// keeps track of which question we are on
var counter = questionsArray.length - 1;


program
  .version('0.0.1')
  .usage('[options] <file ...>')

program
  .command('new [name]')
  .description('makes a new bot')
  .action(function(name) {
    // overwrite default name
    if (typeof(name) !== undefined) {
      project_name = name;
    }
    gulp.src(`${__dirname}/src/**/*`)
    .pipe(gulp.dest(`./${project_name}`))
    // ask first question
    askQuestion(questionsArray[counter].question);

    rl.on('line', (line) => {
      if (isFirstQuestion()) {
        // create .env file
        stream = fs.createWriteStream(`./${project_name}/.env`, {flags: 'a'});
      }

      let varName = questionsArray[counter].varName;

      // write to .env file
      stream.write(`${varName}="${line.trim()}"\n`);

      // go to next question
      counter = counter - 1;

      if (counter < 0) {
        rl.close();
      }

      askQuestion(questionsArray[counter].question);

    }).on('close', () => {
      console.log('Ok thanks! Your bot has been created. Please edit your .env file if you wish to change your answers');
      process.exit(0);
    });
});

program.parse(process.argv);


function askQuestion(question) {
  rl.setPrompt(question);
  rl.prompt();

}

function isFirstQuestion() {
  return ((questionsArray.length - 1) === counter);
}

