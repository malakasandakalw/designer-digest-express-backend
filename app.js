const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = {origin: "http://localhost:4200"}
app.use(cors(corsOptions));

const bodyParser = require("body-parser");
app.use(bodyParser.json())

const routes = require("./routes");
app.use('/api', routes);

module.exports = app;