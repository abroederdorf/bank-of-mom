"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  getAccount,
  deposit,
  withdraw,
  applyMonthlyInterest,
  updateSettings,
  seedAccount,
  addAdmin,
  removeAdmin,
} from "@/lib/account";
import { Account } from "@/lib/types";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function Manage() {
  const { user, role, loading } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [fetching, setFetching] = useState(true);
  const [accountChecked, setAccountChecked] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [newAdminUid, setNewAdminUid] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const refresh = () => {
    setFetching(true);
    getAccount()
      .then((a) => { setAccount(a); setAccountChecked(true); })
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    if (!user) return;
    refresh();
  }, [user]);

  if (loading) return <p className="text-gray-500">Loading…</p>;
  if (!user || role !== "parent") {
    return <p className="text-gray-500 mt-8 text-center">Access restricted to admin accounts.</p>;
  }
  if (fetching) return <p className="text-gray-500">Loading account…</p>;

  if (accountChecked && !account) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Manage Account</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
          <h2 className="font-semibold text-gray-700">First-Time Setup</h2>
          <p className="text-sm text-gray-500">
            Seeds the account with the opening balance of $90 and $1.25 historical interest earned.
            Only do this once.
          </p>
          <p className="text-xs text-gray-400 font-mono">Your UID: {user.uid}</p>
          <button
            disabled={busy}
            onClick={() => run(() => seedAccount(user.uid, "REPLACE_WITH_SON_UID"))}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-gray-700 transition-colors"
          >
            Seed Account
          </button>
        </div>
      </div>
    );
  }

  if (!account) return null;

  const parsedAmount = parseFloat(amount);
  const validAmount = !isNaN(parsedAmount) && parsedAmount > 0;

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    setMessage(null);
    try {
      await fn();
      setAmount("");
      setNote("");
      refresh();
      setMessage({ text: "Done!", ok: true });
    } catch (e: unknown) {
      setMessage({ text: e instanceof Error ? e.message : "Something went wrong", ok: false });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manage Account</h1>

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm font-medium ${
          message.ok ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-700">Deposit / Withdraw</h2>
        <p className="text-sm text-gray-500">Current balance: <span className="font-medium text-gray-800">{fmt(account.balance)}</span></p>
        <div className="flex gap-2">
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            disabled={!validAmount || busy}
            onClick={() => run(() => deposit(parsedAmount, note || "Deposit"))}
            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-green-600 transition-colors"
          >
            Deposit
          </button>
          <button
            disabled={!validAmount || busy || parsedAmount > account.balance}
            onClick={() => run(() => withdraw(parsedAmount, note || "Withdrawal"))}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-red-500 transition-colors"
          >
            Withdraw
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-gray-700">Interest</h2>
        <p className="text-sm text-gray-500">
          Interest posts automatically on the last day of each month.
          Use the button below to post it manually (e.g., for testing).
        </p>
        <button
          disabled={busy}
          onClick={() => run(applyMonthlyInterest)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-blue-500 transition-colors"
        >
          Post Interest Now
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-4">
        <h2 className="font-semibold text-gray-700">Admins</h2>
        <p className="text-sm text-gray-500">
          Your UID: <span className="font-mono text-xs text-gray-600 select-all">{user.uid}</span>
        </p>
        <ul className="space-y-2">
          {account.parentUids.map((uid) => (
            <li key={uid} className="flex items-center justify-between text-sm">
              <span className="font-mono text-xs text-gray-600 truncate mr-3">{uid}</span>
              {account.parentUids.length > 1 && uid !== user.uid && (
                <button
                  onClick={() => run(() => removeAdmin(uid))}
                  disabled={busy}
                  className="text-red-500 hover:text-red-700 text-xs shrink-0"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste UID to add admin"
            value={newAdminUid}
            onChange={(e) => setNewAdminUid(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            disabled={!newAdminUid.trim() || busy}
            onClick={() => run(() => { const uid = newAdminUid.trim(); setNewAdminUid(""); return addAdmin(uid); })}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 hover:bg-gray-700 transition-colors shrink-0"
          >
            Add Admin
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
        <h2 className="font-semibold text-gray-700">Settings</h2>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={account.pendingInterestEnabled}
            onChange={async (e) => { await updateSettings(e.target.checked); refresh(); }}
            className="mt-0.5 h-4 w-4 accent-green-700"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">Hold interest until $10</p>
            <p className="text-sm text-gray-500">
              When enabled, earned interest accumulates in a pending bucket and only
              deposits once it reaches a full $10. This teaches compound interest growth.
              {account.pendingInterest > 0 && (
                <span className="ml-1 text-yellow-700 font-medium">
                  Currently holding {fmt(account.pendingInterest)}.
                </span>
              )}
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}
