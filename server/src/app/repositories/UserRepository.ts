import db from "../services/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import getIdByUsername from "../helpers/getIdByUsername";

import { User } from "../@types/user/User";

const { v4 } = require("uuid");

class UserRepository {
  async findAll() {
    var newUsers: Object[] = [];

    const users = await getDocs(collection(db, "users"));

    users.forEach((doc) => {
      newUsers.push(doc.data());
    });

    return new Promise((resolve) => {
      resolve(newUsers);
    });
  }

  async findByIdOrUsername(id: string) {
    var newUser: Object;

    const users = await getDocs(collection(db, "users"));

    users.forEach((doc) => {
      let user = doc.data();

      if (user.id === id || user.username === id) {
        return (newUser = doc.data());
      }
    });

    return new Promise((resolve) => {
      resolve(newUser);
    });
  }

  async deleteById(id: string) {
    const userID = await getIdByUsername(id);

    if (userID === "") {
      return new Promise((resolve) => {
        resolve(1);
      });
    }

    await deleteDoc(doc(db, "users", userID));

    return new Promise((resolve) => {
      resolve(0);
    });
  }

  async store(user: User) {
    const newUserID = v4();
    const newUser = doc(db, "users", newUserID);

    const newUserData = {
      ...user,
      chatsID: [],
      imageURL: `https://api.dicebear.com/6.x/thumbs/svg?seed=${user.username}`,
      password: newUserID,
      savedMessagesPassword: "0000",
    };

    await setDoc(newUser, newUserData);

    return new Promise((resolve) => {
      resolve(newUserID);
    });
  }

  async update(id: string, data: any) {
    const userID = await getIdByUsername(id);

    if (userID === "") {
      return new Promise((resolve) => {
        resolve(1);
      });
    }

    const userRef = doc(db, "users", userID);

    await updateDoc(userRef, {
      ...data,
    });

    return new Promise((resolve) => {
      resolve(0);
    });
  }
}

module.exports = new UserRepository();
