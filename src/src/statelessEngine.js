"use strict";
const luis = require('./luis.js');
const responses = require('./faq/responses.json');
const request = require('superagent');

function computeResponse(message) {
  return luis
    .query(message)
    .then((result) => {
      console.log('INTENT2', result.intents[0].intent);
      let responseKey = [result.intents[0].intent];
      let computedResponse = [responses[responseKey]];

      if (result.intents[0].intent !== 'None') {
        return computedResponse;
      }
    })
    .then((computedResponse) => {
      if (!computedResponse) {
        return getGif(message)
          .then(res => res)
          .catch(err => console.log(err))
      } else {
        return computedResponse;
      }
    })
    .catch(err => console.log(err));
}

function getGif(message) {
  return new Promise ((resolve, reject) => {
    request.get('http://api.giphy.com/v1/gifs/search')
    .query({q: message})
    .query({limit: 1})
    .query({api_key: "dc6zaTOxFJmzC"})
    .end((err, gif) => {
      if (gif.body.data[0]) {
        responses['None'].attachment.payload.url = gif.body.data[0].images.fixed_height.url;
      }
      resolve([responses['None'], {text: "ooh one sec! I've got a good one"}]);
    });
  });
}

module.exports = { computeResponse };
