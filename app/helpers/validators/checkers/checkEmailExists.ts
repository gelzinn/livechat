import { db } from "app/services/firebase";

export const checkEmailExists = async (email: string) => {
  try {
    const querySnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    return !querySnapshot.empty;
  } catch (error) {
    throw error;
  }
}
