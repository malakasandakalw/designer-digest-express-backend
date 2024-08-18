const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {origin: "http://localhost:4200"}
app.use(cors(corsOptions));

const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const routes = require("./routes");
app.use('/api', routes);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;