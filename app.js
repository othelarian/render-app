const express = require("express");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.type('html').send(html));

app.listen(port, () => console.log('render-app listening...'));



const html = '<!doctype html><html><body>plop</body></html>'

