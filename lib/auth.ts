import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb, googleProvider } from "./firebase";

export async function signIn() {
  const result = await signInWithPopup(getFirebaseAuth(), googleProvider);
  return result.user;
}

export async function signOut() {
  await firebaseSignOut(getFirebaseAuth());
}

export async function getRole(uid: string): Promise<"parent" | "child" | null> {
  const snap = await getDoc(doc(getFirebaseDb(), "account", "main"));
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.parentUid === uid) return "parent";
  if (data.childUid === uid) return "child";
  return null;
}
