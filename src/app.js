require('dotenv').config();
const express = require('express');
const path = require('path');
const hbs = require('hbs');
const Student = require('./models/students');
const cookieParser = require('cookie-parser');
const router = require('./router/studentRegister')
require('./db/connect');

const app = express();
const port = process.env.PORT || 3000;
const staticPath = path.join(__dirname, "../public");
const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");

app.set('view engine', 'hbs');
app.set('views', templatePath);
hbs.registerPartials(partialPath);
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(express.static(staticPath));
app.use(router);

app.listen(port, () => {
    console.log(`listerning to the port ${port}`);
})