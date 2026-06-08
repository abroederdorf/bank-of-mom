"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { signIn } from "@/lib/auth";
import { getAccount, calcMonthlyInterest } from "@/lib/account";
import { Account } from "@/lib/types";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function daysUntilEndOfMonth() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return lastDay.getDate() - now.getDate();
}

export default function Dashboard() {
  const { user, role, loading } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    getAccount()
      .then(setAccount)
      .finally(() => setFetching(false));
  }, [user]);

  if (loading) return <p className="text-gray-500">Loading…</p>;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 gap-6">
        <h1 className="text-3xl font-bold text-green-700">Bank of Mom</h1>
        <p className="text-gray-500">Sign in to view your account</p>
        <button
          onClick={() => signIn()}
          className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (fetching) {
    return <p className="text-gray-500">Loading account…</p>;
  }

  if (!account || role === null) {
    return (
      <div className="mt-16 text-center space-y-3">
        <p className="text-gray-600">You&apos;re signed in but not linked to this account yet.</p>
        <p className="text-sm text-gray-400">Give this UID to an admin to get access:</p>
        <p className="font-mono text-xs bg-gray-100 rounded px-3 py-2 inline-block select-all">{user.uid}</p>
      </div>
    );
  }

  if (!account) {
    return <p className="text-gray-500">Loading account…</p>;
  }

  const monthlyInterest = calcMonthlyInterest(account.balance);
  const days = daysUntilEndOfMonth();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Account Summary</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Current Balance" value={fmt(account.balance)} highlight />
        <StatCard
          label="Interest This Month"
          value={fmt(monthlyInterest)}
          sub={`Posts in ${days} day${days !== 1 ? "s" : ""}`}
        />
        <StatCard label="Total Interest Earned" value={fmt(account.totalInterestEarned)} />
      </div>

      {account.pendingInterestEnabled && account.pendingInterest > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <span className="font-semibold">Pending interest:</span>{" "}
          {fmt(account.pendingInterest)} — will deposit once it reaches the next $10.
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4 text-sm text-gray-600">
        <p>
          Interest rate: <span className="font-medium">$0.25 / month per $10</span>
          {" · "}At your current balance, you earn{" "}
          <span className="font-medium text-green-700">{fmt(monthlyInterest)} per month</span>.
        </p>
        {role === "child" && (
          <p className="mt-1">Ask Mom to make deposits or withdrawals.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-5 ${
        highlight ? "bg-green-700 border-green-700 text-white" : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <p className={`text-xs font-medium uppercase tracking-wide ${highlight ? "text-green-200" : "text-gray-500"}`}>
        {label}
      </p>
      <p className="text-3xl font-bold mt-1">{value}</p>
      {sub && <p className={`text-xs mt-1 ${highlight ? "text-green-200" : "text-gray-400"}`}>{sub}</p>}
    </div>
  );
}
