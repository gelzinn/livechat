"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository = require("../repositories/UserRepository");
class UserController {
    index(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield UserRepository.findAll();
            if (!users) {
                return response
                    .status(404)
                    .json({ message: "Nenhum usuário foi encontrado." });
            }
            response.status(200).json(users);
        });
    }
    show(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const user = yield UserRepository.findByIdOrUsername(id);
            if (!user) {
                return response.status(404).json({ message: "Usuário não encontrado." });
            }
            response.status(200).json(user);
        });
    }
    store(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = yield UserRepository.store(request.body);
            if (userID === "") {
                return response.status(400);
            }
            return response.status(201).json({ id: userID });
        });
    }
    update(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const error = yield UserRepository.update(id, request.body);
            if (error === 1) {
                return response.status(400);
            }
            return response.status(200).json({ success: "Atualização concluída" });
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = request.params;
            const error = yield UserRepository.deleteById(id);
            if (error === 1) {
                return response.status(404).json({ message: "Usuário não encontrado." });
            }
            return response
                .status(204)
                .json({ message: "Usuário deletado com sucesso." });
        });
    }
}
module.exports = new UserController();
