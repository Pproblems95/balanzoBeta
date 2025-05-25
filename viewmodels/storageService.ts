import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionFactory } from '../models/TransactionFactory';
import { Transaction, TransactionType } from '../models/Transaction';
import { Cut } from '../models/Cut';
import { MonthPerformance } from '../models/MonthPerformance';

const TRANSACTIONS_KEY = 'transactions';
const CUTS_KEY = 'cuts';

/**
 * Guarda una transacción nueva (ingreso o gasto)
 */
export async function saveTransaction(
  type: TransactionType,
  id: string,
  title: string,
  amount: number,
  date: string
) {
  const newTransaction = TransactionFactory.createTransaction(type, id, title, amount, date);
  const stored = await AsyncStorage.getItem(TRANSACTIONS_KEY);
  const transactions: Transaction[] = stored ? JSON.parse(stored) : [];
  transactions.push(newTransaction);
  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
}

/**
 * Obtiene todas las transacciones del mes actual
 */
export async function getTransactionsForCurrentMonth(): Promise<Transaction[]> {
  const stored = await AsyncStorage.getItem(TRANSACTIONS_KEY);
  if (!stored) return [];

  const all: Transaction[] = JSON.parse(stored);
  const now = new Date();
  return all.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });
}

/**
 * Guarda un corte mensual
 */
export async function saveCut(cut: Cut) {
  const stored = await AsyncStorage.getItem(CUTS_KEY);
  const cuts: Cut[] = stored ? JSON.parse(stored) : [];
  cuts.push(cut);
  await AsyncStorage.setItem(CUTS_KEY, JSON.stringify(cuts));

  // Limpia las transacciones actuales después del corte
  await AsyncStorage.removeItem(TRANSACTIONS_KEY);
}

/**
 * Obtiene todos los cortes guardados
 */
export async function getAllCuts(): Promise<Cut[]> {
  const stored = await AsyncStorage.getItem(CUTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Obtiene un corte por ID
 */
export async function getCutById(id: string): Promise<Cut | null> {
  const cuts = await getAllCuts();
  return cuts.find((c) => c.id === id) || null;
}

/**
 * Calcula el desempeño financiero de los últimos 12 meses
 */
export async function getMonthlyPerformance(): Promise<MonthPerformance[]> {
  const cuts = await getAllCuts();
  const sorted = cuts.sort((a, b) => {
    const da = new Date(a.createdAt);
    const db = new Date(b.createdAt);
    return db.getTime() - da.getTime();
  });

  const last12 = sorted.slice(0, 12).reverse();

  return last12.map((cut) => {
    const balance = cut.transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);

    return {
      month: cut.month,
      year: cut.year,
      balance,
    };
  });
}
/**
 * Inserta transacciones de prueba en el almacenamiento local
 */
export async function insertMockData() {
  const mockTransactions: Transaction[] = [
    TransactionFactory.createTransaction('income', 't1', 'Sueldo', 6000, new Date().toISOString()),
    TransactionFactory.createTransaction('income', 't2', 'Venta Online', 1200, new Date().toISOString()),
    TransactionFactory.createTransaction('expense', 't3', 'Supermercado', 800, new Date().toISOString()),
    TransactionFactory.createTransaction('expense', 't4', 'Netflix', 200, new Date().toISOString())
  ];

  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(mockTransactions));
}
