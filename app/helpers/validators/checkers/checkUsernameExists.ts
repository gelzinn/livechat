import { db } from "app/services/firebase";

export const checkUsernameExists = async (username: string) => {
  try {
    const querySnapshot = await db
      .collection("users")
      .where("username", "==", username)
      .get();

    return !querySnapshot.empty;
  } catch (error) {
    throw error;
  }
}
