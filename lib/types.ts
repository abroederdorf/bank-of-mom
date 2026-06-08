export type TransactionType = "deposit" | "withdrawal" | "interest";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  note: string;
  createdAt: string; // ISO string
}

export interface Account {
  balance: number;
  totalInterestEarned: number;
  pendingInterest: number;
  pendingInterestEnabled: boolean;
  openedAt: string; // ISO string
  parentUids: string[];
  childUid: string;
}
