import { Request, Response } from "express";

const UserRepository = require("../repositories/UserRepository");

class UserController {
  async index(request: Request, response: Response) {
    const users = await UserRepository.findAll();

    if (!users) {
      return response
        .status(404)
        .json({ message: "Nenhum usuário foi encontrado." });
    }

    response.status(200).json(users);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const user = await UserRepository.findByIdOrUsername(id);

    if (!user) {
      return response.status(404).json({ message: "Usuário não encontrado." });
    }

    response.status(200).json(user);
  }

  async store(request: Request, response: Response) {
    const userID = await UserRepository.store(request.body);

    if (userID === "") {
      return response.status(400);
    }

    return response.status(201).json({ id: userID });
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;

    const error = await UserRepository.update(id, request.body);

    if (error === 1) {
      return response.status(400);
    }

    return response.status(200).json({ success: "Atualização concluída" });
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const error = await UserRepository.deleteById(id);

    if (error === 1) {
      return response.status(404).json({ message: "Usuário não encontrado." });
    }

    return response
      .status(204)
      .json({ message: "Usuário deletado com sucesso." });
  }
}

module.exports = new UserController();
