import { collection, getDocs } from "firebase/firestore";
import db from "../services/firebase";

const getIdByUsername = async (id: string) => {
  const users = await getDocs(collection(db, "users"));
  let newID = "";

  users.forEach((doc) => {
    if (doc.id === id || doc.data().username === id) {
      newID = doc.id;
    }
  });

  return newID;
};

export default getIdByUsername;
