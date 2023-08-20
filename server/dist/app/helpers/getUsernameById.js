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
const firestore_1 = require("firebase/firestore");
const firebase_1 = __importDefault(require("../services/firebase"));
const getUsernameById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.default, "users"));
    let username = "";
    users.forEach((doc) => {
        if (doc.data().id === id || doc.data().username === id) {
            return (username = doc.data().username);
        }
    });
    return username;
});
exports.default = getUsernameById;
