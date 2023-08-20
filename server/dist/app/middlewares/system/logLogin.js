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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IsStringEmpty_1 = __importDefault(require("../../helpers/string/IsStringEmpty"));
const HaveAnySpecialCharacter_1 = __importDefault(require("../../helpers/string/HaveAnySpecialCharacter"));
const logLogin = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = request.body;
    let canLogin = false;
    if (!username) {
        return response.status(400).json({ error: "Preencha o campo 'Username'." });
    }
    if (!password) {
        return response.status(400).json({ error: "Preencha o campo 'Senha'." });
    }
    if ((0, IsStringEmpty_1.default)(username)) {
        return response.status(400).json({ error: "'Username' está vazio." });
    }
    if ((0, HaveAnySpecialCharacter_1.default)(username)) {
        return response
            .status(400)
            .json({ error: "Utilize apenas letras ou números no username." });
    }
    if ((0, IsStringEmpty_1.default)(password)) {
        return response.status(400).json({ error: "'Senha' está vazio." });
    }
    next();
});
exports.default = logLogin;
