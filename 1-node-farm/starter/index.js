const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

/////////////////
// FILES

//blocking, synchronous way
// const textIn = fs.readFileSync('./test.txt', 'utf-8');
// console.log(textIn);
// const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('.output.txt', textOut);
// console.log('File written!');

//non-blocking, asynchronous way
// fs.readFile('./txt/starttt.txt', 'utf-8', (err, data1) => {
//   if (err) {
//     return console.log('error 💣️');
//   }

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written 😄');
//       });
//     });
//   });
// });
// console.log('Will read file!');

////////
// SERVER
const templateOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const templateCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const templateProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');

const data = fs.readFileSync("./dev-data/data.json", 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(e => slugify(e.productName, { lowercase: true }));
console.log(slugs);

const server = http.createServer((req, res) => {

  const { query, pathname } = url.parse(req.url, true);
  console.log(query);
  console.log(pathname);

  if (pathname === '/' || pathname === '/overview') {
    const cardsHtml = dataObj.map(e => replaceTemplate(templateCard, e));
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(output);
    res.end();
  }
  else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(output);
    res.end();
  }
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/html' });
    res.write(data);
    res.end();
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text.html' });
    res.write('<h1>Page not found</h1>!');
    res.end();
  }
});

server.listen(8080, '127.0.0.1', () => {
  console.log('Listening to requests on port 8080');
});

