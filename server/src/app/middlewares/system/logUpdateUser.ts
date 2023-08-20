import { Request, Response, NextFunction } from "express";
import IsStringEmpty from "../../helpers/string/IsStringEmpty";
import HaveAnyNumber from "../../helpers/string/HaveAnyNumber";
import HaveAnySpecialCharacter from "../../helpers/string/HaveAnySpecialCharacter";

import { collection, getDocs } from "firebase/firestore";

import db from "../../services/firebase";

const logNewUser = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { name, username, savedMessagesPassword, chatsID } = request.body;
  var alreadyExists;

  if (request.body.length < 1) {
    return response
      .status(400)
      .json({ error: "Insira os dados a serem atualizados." });
  }

  if (name) {
    if (IsStringEmpty(name)) {
      return response.status(400).json({ error: "Nome está vazio." });
    }
  }

  if (name) {
    if (HaveAnyNumber(name) || HaveAnySpecialCharacter(name)) {
      return response
        .status(400)
        .json({ error: "Utilize apenas letras no nome." });
    }
  }
  if (username) {
    if (IsStringEmpty(username)) {
      return response.status(400).json({ error: "Username está vazio." });
    }

    if (HaveAnySpecialCharacter(username)) {
      return response
        .status(400)
        .json({ error: "Utilize apenas letras ou números no username." });
    }
  }

  const users = await getDocs(collection(db, "users"));
  let newUser;
  alreadyExists = false;

  users.forEach((doc) => {
    newUser = doc.data();
    if (newUser.username == username) {
      return (alreadyExists = true);
    }
  });

  if (alreadyExists) {
    return response
      .status(400)
      .json({ error: "Username já está sendo utilizado." });
  }

  if (savedMessagesPassword) {
    if (IsStringEmpty(savedMessagesPassword)) {
      return response.status(400).json({ error: "A nova senha está vazia." });
    }
  }

  next();
};

export default logNewUser;
