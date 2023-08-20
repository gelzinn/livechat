import {
  DocumentData,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import db from "../services/firebase";

const { v4 } = require("uuid");

class SystemRepository {
  async authLogin({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) {
    const users = await getDocs(collection(db, "users"));
    let newUser;
    let canLogin = false;
    let id = "";
    let authUser: DocumentData = {};
    let token = v4();

    users.forEach((doc) => {
      newUser = doc.data();
      if (
        newUser.username.toLowerCase() == username.toLowerCase() &&
        newUser.password == password
      ) {
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

    await updateDoc(doc(db, "users", id), {
      auth: {
        token,
        createdAt: new Date().getTime(),
      },
    });

    var userRef = await getDoc(doc(db, "users", id));

    if (userRef.exists()) authUser = userRef.data();

    return new Promise((resolve) => {
      resolve({ token, id, authUser });
    });
  }

  async authToken({ token }: { token: string }) {
    const users = await getDocs(collection(db, "users"));
    let newUser;
    let authUser: Object = {};
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
  }
}

module.exports = new SystemRepository();
