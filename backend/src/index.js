import { urlencoded } from 'express';
const express = require('express');

const app = express();

//midelwares
app.use(express.json());
app.use(express.urlencoded());

//routes
app.use(require('./routes/index'));

app.listen(3000);
console.log('Server on port 3000');