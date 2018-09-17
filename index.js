//archivo con la logica
const path = require("path");
const fs = require("fs");

const mdLinks = (ruta)=>{
  return new Promise((resolve, reject)=>{
    //console.log(ruta);
   resolve (reconocimiento(ruta))
  })
}



let pullArch = (ruta)=>{
  let ext = path.extname(ruta)
  if (ext === ".md"){
    return new Promise((resolve, reject) => {
      fs.readFile(ruta, "utf-8", (error, data) => {
        //console.log(typeof data);
        const search = data.match(/\[(.+)\]\((.+)\)/gm);
        //search === array
        let nombreLink =[];
        let urlLink = [];
        let cadalink = search.forEach(etiqueta => {
          //let url = etiqueta.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm);
          //links.push(url); 
          let signo = etiqueta.indexOf("]");
          let signo2 = etiqueta.indexOf("(");
          let marca =  etiqueta.substring(1,signo);
          nombreLink.push(marca);
          let link = etiqueta.substring((signo2+1), (etiqueta.length-1));
          urlLink.push(link);
        })
        if(error) {reject(error)};
        resolve(urlLink);
        //const url = search.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm);
        
        
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

