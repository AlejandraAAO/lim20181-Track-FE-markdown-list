#!/usr/bin/env node
//require al index.js 
const mdLinks = require("./pruebaindex.js");
//todos despues del segundo
const [,, ...args] = process.argv;
const [ruta, ...stadistic] = args;
//guardo en una variable el input despues del comando md-links

//menejando las opciones
const  options = {
  validate : false,
  stats: false,
}
//para cada opcion se asigna true como
//valor en el obj options
stadistic.forEach((value) => {
  if(value === "--v" || value === "--validate" ) {
    options.validate = true;
  } else 
  if (value === "--s" || value === "--stats"){
    options.stats = true;
  }
})


mdLinks(ruta, options)
// name.then(name => console.log(name));
  .then(name => console.log(name))
  .catch(error => console.log(error));
//console.log(`holiiii ${name}`);