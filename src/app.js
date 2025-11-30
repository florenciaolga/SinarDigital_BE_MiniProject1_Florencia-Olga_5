const express = require('express');
const path = require('path');
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));

app.use("/", routes);

app.use(errorHandler);

module.exports = app;
