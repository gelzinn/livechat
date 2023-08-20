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
const HaveAnyNumber_1 = __importDefault(require("../../helpers/string/HaveAnyNumber"));
const HaveAnySpecialCharacter_1 = __importDefault(require("../../helpers/string/HaveAnySpecialCharacter"));
const firestore_1 = require("firebase/firestore");
const firebase_1 = __importDefault(require("../../services/firebase"));
const logNewUser = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username } = request.body;
    var alreadyExists;
    if (!name || !username) {
        return response.status(400).json({ error: "Preencha o nome ou username." });
    }
    if ((0, IsStringEmpty_1.default)(name)) {
        return response.status(400).json({ error: "Nome está vazio." });
    }
    if ((0, HaveAnyNumber_1.default)(name) || (0, HaveAnySpecialCharacter_1.default)(name)) {
        return response
            .status(400)
            .json({ error: "Utilize apenas letras no nome." });
    }
    if ((0, IsStringEmpty_1.default)(username)) {
        return response.status(400).json({ error: "Username está vazio." });
    }
    if ((0, HaveAnySpecialCharacter_1.default)(username)) {
        return response
            .status(400)
            .json({ error: "Utilize apenas letras ou números no username." });
    }
    const users = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.default, "users"));
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
});
exports.default = logNewUser;
