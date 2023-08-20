import { Express } from "express";
const bodyParser = require("body-parser");

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const router = require("./routes");

const app: Express = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.use(router);

app.listen(port, () => {
  console.log(`Started at: http://localhost:${port}`);
});

module.exports = app;
