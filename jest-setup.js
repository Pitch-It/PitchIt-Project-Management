// import regeneratorRuntime from 'regenerator-runtime';
const regeneratorRuntime = require("regenerator-runtime");


module.exports = () => {
  console.log('I am set up!');
  global.testServer = require('./server/server.js');
};