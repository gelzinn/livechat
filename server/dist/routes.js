"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logNewUser_1 = __importDefault(require("./app/middlewares/system/logNewUser"));
const logUpdateUser_1 = __importDefault(require("./app/middlewares/system/logUpdateUser"));
const logLogin_1 = __importDefault(require("./app/middlewares/system/logLogin"));
const logToken_1 = __importDefault(require("./app/middlewares/system/logToken"));
var cors = require("cors");
const Router = require("express");
const UserController = require("./app/controllers/UserController");
const SystemController = require("./app/controllers/SystemController");
const router = Router();
router.options("/users/:id", cors());
router.options("/users", cors());
router.get("/users", cors(), UserController.index);
router.get("/users/:id", cors(), UserController.show);
router.delete("/users/:id", cors(), UserController.delete);
router.post("/users", cors(), (request, response, next) => {
    (0, logNewUser_1.default)(request, response, next);
}, UserController.store);
router.patch("/users/:id", cors(), (request, response, next) => {
    (0, logUpdateUser_1.default)(request, response, next);
}, UserController.update);
router.options("/auth/login", cors());
router.post("/auth/login", cors(), (request, response, next) => {
    (0, logLogin_1.default)(request, response, next);
}, SystemController.login);
router.options("/auth/token", cors());
router.post("/auth/token", cors(), (request, response, next) => {
    (0, logToken_1.default)(request, response, next);
}, SystemController.token);
module.exports = router;
