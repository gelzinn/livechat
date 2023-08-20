import {  collection, getDocs } from "firebase/firestore";
import db from "../services/firebase";

const getUsernameById = async (id: string) => {
  const users = await getDocs(collection(db, "users"));
  let username: string = "";

  users.forEach((doc) => {
    if (doc.data().id === id || doc.data().username === id) {
      return (username = doc.data().username);
    }
  });

  return username;
};

export default getUsernameById;
