# Markdown Links

## Descripción

Md-Links es una libreria que utiliza Node.js para leer y analizar archivos en formato `Markdown` y verificar los links que contengan adicionando algunas estadísticas.

## Instrucciones de instalación

Módulo instalable directamente desde este repositorio de Github via 
`npm install <AlejandraAAO>/md-links`

## Version
1.0.1 : Soporte para archivos Markdown, incluye tres funcionalidades:
 - `validate`: Valida los links encontrados en
   el archivo y muestra su status.
 - `stats`: Calcula el total de links y los unicos.
 - `validate stats`: Muestra el total de links, los unicos y los rotos.

### JavaScript API

#### `mdLinks(path, options)`

##### Argumentos

- `path`: Ruta absoluta o relativa al archivo o directorio. Si la ruta pasada es
 relativa, debe resolverse como absoluta al directorio desde donde se invoca
 node - _currentworking directory_).

- `options`: Un objeto con las siguientes propiedades:
  - `validate`: Valor que determina si se desea validar los links encontrados en
   el archivo. (tipo de dato booleano)
  - `stats`: Valor que determina si se desea calcular los stats de de los links
  encontrados en el archivo. (tipo de dato booleano)

##### Valor de retorno

La función debe retornar una promesa (`Promise`) que resuelva a un arreglo
(`Array`) de objetos (_Object_), donde cada objeto representa un link y contiene
las siguientes propiedades:

- `href`: URL encontrada.
- `text`: Texto que aparecía dentro del link (`<a>`).
- `file`: Ruta del archivo donde se encontró el link.

#### Ejemplo

```js
const mdLinks = require("md-links");

mdLinks("./some/example.md")
  .then(links => {
    // => [{ href, text, file }]
  })
  .catch(console.error);

mdLinks("./some/example.md", { validate: true })
  .then(links => {
    // => [{ href, text, file, status, ok }]
  })
  .catch(console.error);

mdLinks("./some/example.md", { stats: true })
  .then(links => {
    // => [{total, unique }]
  })
  .catch(console.error);

  mdLinks("./some/example.md", { stats: true, validate:true })
  .then(links => {
    // => [{total, unique, broken }]
  })
  .catch(console.error);

mdLinks("./some/dir")
  .then(links => {
    // => [{ href, text, file }]
  })
  .catch(console.error);
```

### CLI (Línea de comando)

El ejecutable de nuestra aplicación debe poder ejecutarse de la siguiente
manera a través de la terminal:

`md-links <path-to-file> [options]`

Por ejemplo:

```sh
$ md-links ./some/example.md
./some/example.md http://algo.com/2/3/ Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html algún doc
./some/example.md http://google.com/ Google
```

El comportamiento por defecto, analizar el archivo Markdown e imprimir los links que vaya encontrando, junto con la ruta del archivo donde aparece y el texto
que hay dentro del link.

#### Options

##### `--validate`

Si pasamos la opción `--validate`, el módulo hace una petición HTTP para
averiguar si el link funciona o no. Si el link resulta en una redirección a una
URL que responde ok, entonces consideraremos el link como ok.

Por ejemplo:

```sh
$ md-links ./some/example.md --validate
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
```

Vemos que el _output_ en este caso incluye la palabra `ok` o `fail` después de
la URL, así como el status de la respuesta recibida a la petición HTTP a dicha
URL.

##### `--stats`

Si pasamos la opción `--stats` el output (salida) será un texto con estadísticas
básicas sobre los links.

```sh
$ md-links ./some/example.md --stats
Total: 3
Unique: 3
```

También podemos combinar `--stats` y `--validate` para obtener estadísticas que
necesiten de los resultados de la validación.

```sh
$ md-links ./some/example.md --stats --validate
Total: 3
Unique: 3
Broken: 1
```


