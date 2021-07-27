// This file serves as an example
const express = require('express');
const autoindexJson = require('./index');

const app = express();
const DATA_DIR = '.';
const PORT = 3000;

app.use('/files', autoindexJson(DATA_DIR), express.static(DATA_DIR));
app.listen(PORT);
