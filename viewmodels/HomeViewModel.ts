// src/viewmodels/HomeViewModel.ts

import { useEffect, useState } from "react";
import { Transaction } from "../models/Transaction";
import { calculateCutBalance } from "../models/Cut";
// Importa la nueva función de suscripción
import { getTransactionsForCurrentMonth, insertMockData, subscribeToBalanceChanges } from "./storageService";

export function useHomeViewModel() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {

    initializeData();

 
    const unsubscribe = subscribeToBalanceChanges(loadTransactions);


    return () => {
      unsubscribe();
      console.log('HomeViewModel: Desuscrito de cambios de balance.');
    };
  }, []); 

  async function initializeData() {
    console.log('HomeViewModel: Inicializando datos...');
    const existing = await getTransactionsForCurrentMonth();
    if (existing.length === 0) {
      await insertMockData();
    }
    await loadTransactions();
  }

  async function loadTransactions() {
    console.log('HomeViewModel: Cargando transacciones y calculando balance...');
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