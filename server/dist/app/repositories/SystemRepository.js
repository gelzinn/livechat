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
const { v4 } = require("uuid");
class SystemRepository {
    authLogin({ username, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.default, "users"));
            let newUser;
            let canLogin = false;
            let id = "";
            let authUser = {};
            let token = v4();
            users.forEach((doc) => {
                newUser = doc.data();
                if (newUser.username.toLowerCase() == username.toLowerCase() &&
                    newUser.password == password) {
                    id = doc.id;
                    authUser = newUser;
                    return (canLogin = true);
                }
            });
            if (!canLogin) {
                return new Promise((resolve) => {
                    resolve({ token, id, authUser });
                });
            }
            yield (0, firestore_1.updateDoc)((0, firestore_1.doc)(firebase_1.default, "users", id), {
                auth: {
                    token,
                    createdAt: new Date().getTime(),
                },
            });
            var userRef = yield (0, firestore_1.getDoc)((0, firestore_1.doc)(firebase_1.default, "users", id));
            if (userRef.exists())
                authUser = userRef.data();
            return new Promise((resolve) => {
                resolve({ token, id, authUser });
            });
        });
    }
    authToken({ token }) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.default, "users"));
            let newUser;
            let authUser = {};
            let tokenCreatedAt = 0;
            users.forEach((doc) => {
                newUser = doc.data();
                if (newUser.auth) {
                    if (newUser.auth.token == token) {
                        tokenCreatedAt = newUser.auth.createdAt;
                        authUser = newUser;
                        return authUser;
                    }
                }
            });
            if (new Date().getTime() - tokenCreatedAt > 86400000) {
                return new Promise((resolve) => {
                    resolve(0);
                });
            }
            return new Promise((resolve) => {
                resolve(authUser);
            });
        });
    }
}
module.exports = new SystemRepository();
