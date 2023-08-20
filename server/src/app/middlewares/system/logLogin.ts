import { Request, Response, NextFunction } from "express";
import IsStringEmpty from "../../helpers/string/IsStringEmpty";
import HaveAnySpecialCharacter from "../../helpers/string/HaveAnySpecialCharacter";

const logLogin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const { username, password } = request.body;
  let canLogin = false;
  if (!username) {
    return response.status(400).json({ error: "Preencha o campo 'Username'." });
  }

  if (!password) {
    return response.status(400).json({ error: "Preencha o campo 'Senha'." });
  }

  if (IsStringEmpty(username)) {
    return response.status(400).json({ error: "'Username' está vazio." });
  }

  if (HaveAnySpecialCharacter(username)) {
    return response
      .status(400)
      .json({ error: "Utilize apenas letras ou números no username." });
  }

  if (IsStringEmpty(password)) {
    return response.status(400).json({ error: "'Senha' está vazio." });
  }

  next();
};

export default logLogin;
