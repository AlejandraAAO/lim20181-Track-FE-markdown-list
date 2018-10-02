const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
//primero funciones 
//obteniendo el path si es file 

const pathIs = (ruta)=>{
  return new Promise ((resolve, reject)=>{
    fs.lstat(ruta,(e, data)=> {
      if(e) return reject (e);
      if(data.isDirectory()){
        //deberia retornar un array de dir ofiles **recursion
        return console.log("hola eres dir");
      } else if(data.isFile()){    
        resolve (ruta);
      }
    })  
  })    
};
//cuando sepa si es file, paso a verificar si es md
const mdIs = (ruta) => {
  const ext = path.extname(ruta)
  if(ext === ".md"){
    return ruta
  } else {
    console.log("Tu archivo no es Markdown :(");
  }
};
//cuando sepa si es md, lo leo
const readMd = (ruta) => {
  return new Promise((resolve, reject)=>{
    fs.readFile(ruta, 'utf8', (e,data)=>{
      if(e) reject(e);
      resolve(data);
    });
  })
};
//con elarchivo md leido encontrar la coincidencia [abc](abc.com)
const matchRxMd = (text) => {
  const search = text.match(/\[(.+)\]\((.+)\)/gm);
  //search es un array de valores []()
  return search;
};
//con el array de elementos, creamos el objeto q se va a devolver
const infoFile = (arrayElements, pathReturn) => {
  let arrayComplete = arrayElements.map(etiqueta => {
    let signo = etiqueta.indexOf("]");
    let signo2 = etiqueta.indexOf("(");
    let text =  etiqueta.substring(1,signo);
    let href = etiqueta.substring((signo2+1), (etiqueta.length-1));
    const objectR ={
      text: text,
      href: href,
      file: pathReturn,
    };
    return objectR;
  });
  return arrayComplete;
};
const dataLinks = (text) => {
  const search = text.match(/((\w+:\/\/)[-a-zA-Z0-9:@;?&=\/%\+\.\*!'\(\),\$_\{\}\^~\[\]`#|]+)/gi)
  return search;
}
//--validate: por cada link consultar su status
//y meterlo dentro del objeto 

const validateLinks = (url, textUrl, ruta) => {
  return fetch(url)
  .then(data => {
    let status = data.status;
    let statusText = data.statusText;
    console.log(ruta, url, status, statusText, textUrl);
  })
  .catch(e => {
    let status = e.code;
    let statusText = "fail";
    console.log(ruta, url, status, statusText, textUrl);
  })
}

//--stats: va a contar los links y sacara los unicos y los rotos
const stats = (arrayLinks) =>{
    let total = arrayLinks.length;
    let unique = Array.from(new Set(arrayLinks));
    const obj = {
      Total : total,
      Unique: unique.length,
    }
    return obj; 
}

const validatestats = ()=>{};


const mdLinks = (ruta, options) => {
  return new Promise((resolve)=>{
    if (!options.validate && !options.stats){
    return pathIs(ruta)
    .then(result => mdIs(result))
    .then(result => readMd(result))
    .then(data => matchRxMd(data))
    .then(array => 
      resolve (infoFile(array, ruta)))
     //si validate
  } else if (options.validate &&!options.stats) {
    return pathIs(ruta)
    .then(result => mdIs(result))
    .then(result => readMd(result))
    .then(data => matchRxMd(data))
    .then(array => infoFile(array, ruta))
    .then(data =>
      data.forEach(elmt => {
        const url = elmt.href;
        const textUrl = elmt.text;
        resolve (validateLinks(url, textUrl, ruta))
      })
         
    )//si stats
  } else if (!options.validate && options.stats){
    return pathIs(ruta)
    .then(result => mdIs(result))
    .then(result => readMd(result))
    .then(data => dataLinks(data))
    .then(array => stats(array)) 
    .then(response => console.log(response))
      
    }
})
};
module.exports = mdLinks;