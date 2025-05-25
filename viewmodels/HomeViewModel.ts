import { useEffect, useState } from "react";
import { Transaction } from "../models/Transaction";
import { calculateCutBalance } from "../models/Cut";
import { getTransactionsForCurrentMonth, insertMockData } from "./storageService";

export function useHomeViewModel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    initializeData();
  }, []);

  async function initializeData() {
    const existing = await getTransactionsForCurrentMonth();
    if (existing.length === 0) {
      await insertMockData();
    }
    await loadTransactions();
  }

  async function loadTransactions() {
    const data = await getTransactionsForCurrentMonth();
    setTransactions(data);
    setBalance(calculateCutBalance(data));
  }

  return {
    transactions,
    balance,
    reload: loadTransactions,
  };
}
