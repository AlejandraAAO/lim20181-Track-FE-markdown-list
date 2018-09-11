#!/usr/bin/env node
//require al index.js 
const mdLinks = require("./index.js");

//todos despues del segundo
const [,, ...args] = process.argv;
let ruta = args[0];//guardo en una variable el input despues del comando md-links
let  name = mdLinks.arch(ruta)
  .then(name => console.log(`holiiii ${name}`))
  .catch(error => console(error));
//console.log(`holiiii ${name}`);