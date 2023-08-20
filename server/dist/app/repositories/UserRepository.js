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
const firebase_1 = __importDefault(require("../services/firebase"));
const firestore_1 = require("firebase/firestore");
const getIdByUsername_1 = __importDefault(require("../helpers/getIdByUsername"));
const { v4 } = require("uuid");
class UserRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            var newUsers = [];
            const users = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.default, "users"));
            users.forEach((doc) => {
                newUsers.push(doc.data());
            });
            return new Promise((resolve) => {
                resolve(newUsers);
            });
        });
    }
    findByIdOrUsername(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var newUser;
            const users = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.default, "users"));
            users.forEach((doc) => {
                let user = doc.data();
                if (user.id === id || user.username === id) {
                    return (newUser = doc.data());
                }
            });
            return new Promise((resolve) => {
                resolve(newUser);
            });
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = yield (0, getIdByUsername_1.default)(id);
            if (userID === "") {
                return new Promise((resolve) => {
                    resolve(1);
                });
            }
            yield (0, firestore_1.deleteDoc)((0, firestore_1.doc)(firebase_1.default, "users", userID));
            return new Promise((resolve) => {
                resolve(0);
            });
        });
    }
    store(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUserID = v4();
            const newUser = (0, firestore_1.doc)(firebase_1.default, "users", newUserID);
            const newUserData = Object.assign(Object.assign({}, user), { chatsID: [], imageURL: `https://api.dicebear.com/6.x/thumbs/svg?seed=${user.username}`, password: newUserID, savedMessagesPassword: "0000" });
            yield (0, firestore_1.setDoc)(newUser, newUserData);
            return new Promise((resolve) => {
                resolve(newUserID);
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userID = yield (0, getIdByUsername_1.default)(id);
            if (userID === "") {
                return new Promise((resolve) => {
                    resolve(1);
                });
            }
            const userRef = (0, firestore_1.doc)(firebase_1.default, "users", userID);
            yield (0, firestore_1.updateDoc)(userRef, Object.assign({}, data));
            return new Promise((resolve) => {
                resolve(0);
            });
        });
    }
}
module.exports = new UserRepository();
