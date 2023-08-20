import { Request, Response, NextFunction } from "express";
import IsStringEmpty from "../../helpers/string/IsStringEmpty";
import HaveAnySpecialCharacter from "../../helpers/string/HaveAnySpecialCharacter";

import { collection, getDocs } from "firebase/firestore";

import db from "../../services/firebase";

const logToken = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { token } = request.body;

  if (!token || IsStringEmpty(token)) {
    return response
      .status(400)
      .json({ error: "Insira um token para a verificação." });
  }

  next();
};

export default logToken;
