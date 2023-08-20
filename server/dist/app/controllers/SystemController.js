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
const SystemRepository = require("../repositories/SystemRepository");
class SystemController {
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, id, authUser } = yield SystemRepository.authLogin(request.body);
            if (id == "") {
                return response
                    .status(400)
                    .json({ error: "'Username' ou 'Senha' incorretos." });
            }
            return response.status(200).json({ token, id, authUser });
        });
    }
    token(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield SystemRepository.authToken(request.body);
            if (user == 0) {
                return response.status(400).json({ error: "Token expirado." });
            }
            if (Object.keys(user).length === 0) {
                return response.status(400).json({ error: "Token inválido." });
            }
            return response.status(200).json(user);
        });
    }
}
module.exports = new SystemController();
