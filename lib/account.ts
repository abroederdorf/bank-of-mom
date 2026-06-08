import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import { Account, Transaction, TransactionType } from "./types";

const ACCOUNT_ID = "main";
const db = () => getFirebaseDb();

export function calcMonthlyInterest(balance: number): number {
  return Math.floor(balance / 10) * 0.25;
}

export async function getAccount(): Promise<Account | null> {
  const snap = await getDoc(doc(db(), "account", ACCOUNT_ID));
  return snap.exists() ? (snap.data() as Account) : null;
}

export async function getTransactions(): Promise<Transaction[]> {
  const q = query(
    collection(db(), "account", ACCOUNT_ID, "transactions"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Transaction));
}

async function addTransaction(
  type: TransactionType,
  amount: number,
  balanceBefore: number,
  balanceAfter: number,
  note: string
) {
  await addDoc(collection(db(), "account", ACCOUNT_ID, "transactions"), {
    type,
    amount,
    balanceBefore,
    balanceAfter,
    note,
    createdAt: new Date().toISOString(),
  });
}

export async function deposit(amount: number, note = ""): Promise<void> {
  const account = await getAccount();
  if (!account) throw new Error("Account not found");
  const before = account.balance;
  const after = before + amount;
  await updateDoc(doc(db(), "account", ACCOUNT_ID), { balance: after });
  await addTransaction("deposit", amount, before, after, note);
}

export async function withdraw(amount: number, note = ""): Promise<void> {
  const account = await getAccount();
  if (!account) throw new Error("Account not found");
  if (amount > account.balance) throw new Error("Insufficient funds");
  const before = account.balance;
  const after = before - amount;
  await updateDoc(doc(db(), "account", ACCOUNT_ID), { balance: after });
  await addTransaction("withdrawal", amount, before, after, note);
}

export async function applyMonthlyInterest(): Promise<void> {
  const account = await getAccount();
  if (!account) throw new Error("Account not found");

  const earned = calcMonthlyInterest(account.balance);
  if (earned === 0) return;

  const newTotalEarned = account.totalInterestEarned + earned;

  if (account.pendingInterestEnabled) {
    const newPending = account.pendingInterest + earned;
    const toDeposit = Math.floor(newPending / 10) * 10;
    const remaining = newPending - toDeposit;

    if (toDeposit > 0) {
      const before = account.balance;
      const after = before + toDeposit;
      await updateDoc(doc(db(), "account", ACCOUNT_ID), {
        balance: after,
        pendingInterest: remaining,
        totalInterestEarned: newTotalEarned,
      });
      await addTransaction(
        "interest",
        toDeposit,
        before,
        after,
        `Interest deposited ($${remaining.toFixed(2)} pending)`
      );
    } else {
      await updateDoc(doc(db(), "account", ACCOUNT_ID), {
        pendingInterest: newPending,
        totalInterestEarned: newTotalEarned,
      });
    }
  } else {
    const before = account.balance;
    const after = before + earned;
    await updateDoc(doc(db(), "account", ACCOUNT_ID), {
      balance: after,
      totalInterestEarned: newTotalEarned,
    });
    await addTransaction("interest", earned, before, after, "Monthly interest");
  }
}

export async function updateSettings(pendingInterestEnabled: boolean): Promise<void> {
  await updateDoc(doc(db(), "account", ACCOUNT_ID), { pendingInterestEnabled });
}

export async function seedAccount(parentUid: string, childUid: string): Promise<void> {
  await setDoc(doc(db(), "account", ACCOUNT_ID), {
    balance: 90,
    totalInterestEarned: 1.25,
    pendingInterest: 0,
    pendingInterestEnabled: false,
    openedAt: "2026-06-06T00:00:00.000Z",
    parentUid,
    childUid,
  } as Account);
}
