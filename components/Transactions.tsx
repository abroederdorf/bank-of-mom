"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getTransactions } from "@/lib/account";
import { Transaction } from "@/lib/types";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

const TYPE_STYLES = {
  deposit: "bg-green-100 text-green-800",
  withdrawal: "bg-red-100 text-red-800",
  interest: "bg-blue-100 text-blue-800",
};

export default function Transactions() {
  const { user, loading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    getTransactions()
      .then(setTransactions)
      .finally(() => setFetching(false));
  }, [user]);

  if (loading || !user) return <p className="text-gray-500">Loading…</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800">Transaction Log</h1>

      {fetching ? (
        <p className="text-gray-500">Loading transactions…</p>
      ) : transactions.length === 0 ? (
        <p className="text-gray-400 text-sm">No transactions yet.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
          {transactions.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${TYPE_STYLES[t.type]}`}
                >
                  {t.type}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {t.note || capitalize(t.type)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(t.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={`text-sm font-bold ${
                    t.type === "withdrawal" ? "text-red-600" : "text-green-700"
                  }`}
                >
                  {t.type === "withdrawal" ? "-" : "+"}{fmt(t.amount)}
                </p>
                <p className="text-xs text-gray-400">Balance: {fmt(t.balanceAfter)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
