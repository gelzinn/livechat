"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const router = require("./routes");
const app = express();
const port = process.env.PORT;
app.use(bodyParser.json());
app.use(router);
app.listen(port, () => {
    console.log(`Started at: http://localhost:${port}`);
});
module.exports = app;
