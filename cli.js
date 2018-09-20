#!/usr/bin/env node
//require al index.js 
const mdLinks = require("./pruebaindex.js");
//todos despues del segundo
const [,, ...args] = process.argv;
let ruta = args[0];//guardo en una variable el input despues del comando md-links

let options = {
  validate : null,
  stats: null,
}
mdLinks(ruta)
//name.then(name => console.log(name));
  .then(name => console.log(name))
  //.catch(error => console.log(error));
//console.log(`holiiii ${name}`);