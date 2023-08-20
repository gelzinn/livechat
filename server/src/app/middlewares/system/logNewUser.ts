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
  const { name, username } = request.body;
  var alreadyExists;

  if (!name || !username) {
    return response.status(400).json({ error: "Preencha o nome ou username." });
  }

  if (IsStringEmpty(name)) {
    return response.status(400).json({ error: "Nome está vazio." });
  }

  if (HaveAnyNumber(name) || HaveAnySpecialCharacter(name)) {
    return response
      .status(400)
      .json({ error: "Utilize apenas letras no nome." });
  }

  if (IsStringEmpty(username)) {
    return response.status(400).json({ error: "Username está vazio." });
  }

  if (HaveAnySpecialCharacter(username)) {
    return response
      .status(400)
      .json({ error: "Utilize apenas letras ou números no username." });
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

  next();
};

export default logNewUser;
