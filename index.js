//archivo con la logica
const path = require("path");
const fs = require("fs");

const mdLinks = (ruta)=>{
  return new Promise((resolve, reject)=>{
    console.log(ruta);
   resolve (reconocimiento(ruta))
  })
}

let pullArch = (ruta)=>{
  let ext = path.extname(ruta)
  if (ext === ".md"){
    return new Promise((resolve, reject) => {
      fs.readFile(ruta, "utf-8", (error, data) => {
        //console.log(typeof data);
        const search = data.match(/\[([^\]]+)\](\([^\)]+\)|\[[^\]]+\])/gm)
        //search === array
        
        if(error) {reject(error)};
        resolve(search);
      });
    });
  }
}

  
  const reconocimiento = (ruta)=>{
     const stats = fs.lstatSync(ruta)   
     if(stats.isDirectory()){
       return console.log("hola");
     } else if(stats.isFile()){    
       return pullArch(ruta)
     }
  }


//exports.arch = pullArch;
exports.read = mdLinks;

