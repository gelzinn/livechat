import { Request, Response } from "express";
const SystemRepository = require("../repositories/SystemRepository");

class SystemController {
  async login(request: Request, response: Response) {
    const { token, id, authUser } = await SystemRepository.authLogin(
      request.body
    );

    if (id == "") {
      return response
        .status(400)
        .json({ error: "'Username' ou 'Senha' incorretos." });
    }

    return response.status(200).json({ token, id, authUser });
  }

  async token(request: Request, response: Response) {
    const user = await SystemRepository.authToken(request.body);

    if (user == 0) {
      return response.status(400).json({ error: "Token expirado." });
    }

    if (Object.keys(user).length === 0) {
      return response.status(400).json({ error: "Token inválido." });
    }

    return response.status(200).json(user);
  }
}

module.exports = new SystemController();
