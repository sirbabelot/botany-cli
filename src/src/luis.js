"use strict";
const request = require('superagent');


function query(queryString) {
  return new Promise((resolve, reject) => {
    let luisEndpoint = process.env.LUIS_URI;

    if (!luisEndpoint) {
      console.log('LUIS endpoint not set!');
    }

    if (typeof queryString === 'string') {
      let encodedQueryString = encodeURI(queryString);
      luisEndpoint += `&q=${encodedQueryString}`;
    }

    request
      .get(luisEndpoint)
      .end((err, response) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        else { resolve(response.body); }
      })
  })
}

module.exports = { query };
