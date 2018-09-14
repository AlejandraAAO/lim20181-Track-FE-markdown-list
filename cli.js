#!/usr/bin/env node
//require al index.js 
const mdLinks = require("./index.js");

//todos despues del segundo
const [,, ...args] = process.argv;
let ruta = args[0];//guardo en una variable el input despues del comando md-links
let  name = mdLinks.read(ruta)
//name.then(name => console.log(name));
  .then(name => console.log(name))
  //.catch(error => console.log(error));
//console.log(`holiiii ${name}`);