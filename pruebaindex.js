const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");
//primero funciones 
//obteniendo el path si es file 

const pathIs = (ruta) => {
  return new Promise((resolve, reject) => {
    fs.lstat(ruta, (e, data) => {
      if (e) return reject(e);
      if (data.isDirectory()) {
        //deberia retornar un array de dir ofiles **recursion
        return console.log(" linea 13 hola eres dir");
      } else if (data.isFile()) {
        resolve(ruta);
      }
    })
  })
};
//cuando sepa si es file, paso a verificar si es md
const mdIs = (ruta) => {
  const ext = path.extname(ruta)
  if (ext === ".md") {
    return ruta
  } else {
    console.log("linea 26 Tu archivo no es Markdown :(");
  }
};
//cuando sepa si es md, lo leo
const readMd = (ruta) => {
  return new Promise((resolve, reject) => {
    fs.readFile(ruta, 'utf8', (e, data) => {
      if (e) reject(e);
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
    let text = etiqueta.substring(1, signo);
    let href = etiqueta.substring((signo2 + 1), (etiqueta.length - 1));
    const objectR = {
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
const validateLink = ({ text, href, file }) => {
  return fetch(href)
    .catch(() => {
      return ({
        status: 404,
        statusText: "Fail"
      })
    })
    .then(response => {
      return ({
        href, text, file,
        status: response.status,
        value: response.statusText,
      })
    })
}
//recorro el array de objetos y devuelvo una promesa con sus nuevos keys
const validateArrayObjects = (arrayObjects) => {
  return new Promise((resolve) => {
    const arrValidate = arrayObjects.map(object =>
      validateLink(object))
    Promise.all(arrValidate).then(res =>
      resolve(res))
  })
}
//--stats: va a contar los links y sacara los unicos y los rotos
const stats = (arrayLinks) => {
  let total = arrayLinks.length;
  let unique = Array.from(new Set(arrayLinks));
  const obj = {
    Total: total,
    Unique: unique.length,
  }
  return obj;
}
//array de objetos con links => numero de links rotos
const brokenLinks = (arrayObjects) => {
  const arrBroken = [];
  arrayObjects.map((object) => {
    if (object.status === 404) {
      arrBroken.push(object.href)
    }
  });
  return (arrBroken.length)
};

const objetcLinks = (arrayObjects) => {
  // let links=[];
  let href = arrayObjects.filter((obj) => (obj.href));
  let unique = Array.from(new Set(href));
  return unique;
}
//
const validateIStats = (arrayObjLinks) => {
  //entro validando
  return new Promise((resolve) => {
    resolve([{
      Total: arrayObjLinks.length,
      Unique: (objetcLinks(arrayObjLinks)).length,
      Broken: brokenLinks(arrayObjLinks),
    }])
  })

};


const mdLinks = (ruta, options) => {
  return new Promise((resolve) => {
    if (!options.validate && !options.stats) {
      return pathIs(ruta)
        .then(result => mdIs(result))
        .then(result => readMd(result))
        .then(data => matchRxMd(data))
        .then(array =>
          resolve(infoFile(array, ruta)))
      //si validate
    } else if (options.validate && options.stats) {
      return pathIs(ruta)
        .then(result => mdIs(result))
        .then(result => readMd(result))
        .then(data => matchRxMd(data))
        .then(array => infoFile(array, ruta))
        .then(array => validateArrayObjects(array))
        .then(array => validateIStats(array))
        .then(response => console.log(response))

    } else if (options.validate && !options.stats) {
      return pathIs(ruta)
        .then(result => mdIs(result))
        .then(result => readMd(result))
        .then(data => matchRxMd(data))
        .then(array => infoFile(array, ruta))
        .then(data =>
          resolve(validateArrayObjects(data))

        )//si stats
    } else if (!options.validate && options.stats) {
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