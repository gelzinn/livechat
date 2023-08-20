import { NextFunction, Request, Response } from "express";
import logNewUser from "./app/middlewares/system/logNewUser";
import logUpdateUser from "./app/middlewares/system/logUpdateUser";
import logLogin from "./app/middlewares/system/logLogin";
import logToken from "./app/middlewares/system/logToken";
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
router.post(
  "/users",
  cors(),
  (request: Request, response: Response, next: NextFunction) => {
    logNewUser(request, response, next);
  },
  UserController.store
);
router.patch(
  "/users/:id",
  cors(),
  (request: Request, response: Response, next: NextFunction) => {
    logUpdateUser(request, response, next);
  },
  UserController.update
);

router.options("/auth/login", cors());

router.post(
  "/auth/login",
  cors(),
  (request: Request, response: Response, next: NextFunction) => {
    logLogin(request, response, next);
  },
  SystemController.login
);

router.options("/auth/token", cors());

router.post(
  "/auth/token",
  cors(),
  (request: Request, response: Response, next: NextFunction) => {
    logToken(request, response, next);
  },
  SystemController.token
);

module.exports = router;
