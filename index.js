//archivo con la logica
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

const mdLinks = (ruta)=>{
  return new Promise((resolve, reject)=>{
    //console.log(ruta);
   resolve (reconocimiento(ruta))
  })
}

let fecheando = (arrayLinks)=>{
 return new Promise((resolve)=>{
   
   let status = arrayLinks.map(arrayLink => {
     let result  = fetch(arrayLink)
     .then(data => data.statusText);
   }) 
   
   resolve(status);
 })
}

const pullArch = (ruta)=>{
  let ext = path.extname(ruta)
  if (ext === '.md'){
    return new Promise((resolve, reject) => {
      fs.readFile(ruta, "utf-8", (error, data) => {
        //console.log(typeof data);
        const search = data.match(/\[(.+)\]\((.+)\)/gm);
        //search === array
        // let nombreLink =[]; 
        // let urlLink = [];
        let cadalink = search.map(etiqueta => {
          let signo = etiqueta.indexOf("]");
          let signo2 = etiqueta.indexOf("(");
          let text =  etiqueta.substring(1,signo);
          let href = etiqueta.substring((signo2+1), (etiqueta.length-1));
          return ({
            text: text,
            href: href,
            file: ruta,
          })
          
          })
        if(error) reject(error);
        //let result = fecheando(urlLink);
       resolve(cadalink);
        //const url = search.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm);
        
        
      });
    });
  }
};

  
  const reconocimiento = (ruta)=>{
     const stats = fs.lstatSync(ruta)   
     if(stats.isDirectory()){
       //retornar un array de
       return console.log("hola");
     } else if(stats.isFile()){    
       return pullArch(ruta)
     }
  }

m
//exports.arch = pullArch;
exports.read = mdLinks;

