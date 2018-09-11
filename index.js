//archivo con la logica
const path = require("path");
const fs = require("fs");

let pullArch = (ruta)=>{
//   let ext = path.extname(ruta)
//   if (ext === ".md"){
//     console.log("es md muy bien")  
//   } else {
//     console.log("nounou")
//   };
//  return ext
return new Promise((resolve, reject) => {
  fs.readFile(ruta, "utf-8", (error, data) => {
    if(error) {reject(error)};
    resolve(data);
  });
});
}

exports.arch = pullArch;

