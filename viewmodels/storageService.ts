import AsyncStorage from '@react-native-async-storage/async-storage';
import { TransactionFactory } from '../models/TransactionFactory';
import { Transaction, TransactionType } from '../models/Transaction';
import { Cut } from '../models/Cut';
import { MonthPerformance } from '../models/MonthPerformance';
import { Income, Expense } from '../models/Transaction';


const TRANSACTIONS_KEY = 'transactions';
const CUTS_KEY = 'cuts';

/**
 * Saves a new transaction (income or expense).
 */
export async function saveTransaction(
  type: TransactionType,
  id: string,
  title: string,
  amount: number,
  date: string
) {
  console.log('saving transaction...');
  const newTransaction = TransactionFactory.createTransaction(type, id, title, amount, date);
  const stored = await AsyncStorage.getItem(TRANSACTIONS_KEY);
  const transactions: Transaction[] = stored ? JSON.parse(stored) : [];
  transactions.push(newTransaction);
  
  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  console.log('Transaction saved.');
}

/**
 * Gets all transactions for the current month.
 */
export async function getTransactionsForCurrentMonth(): Promise<Transaction[]> {
  const stored = await AsyncStorage.getItem('transactions');
  const transactions: Transaction[] = stored ? JSON.parse(stored) : [];

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
}

/**
 * Saves a monthly cut.
 */
export async function saveCut(cut: Cut) {
  const stored = await AsyncStorage.getItem(CUTS_KEY);
  const cuts: Cut[] = stored ? JSON.parse(stored) : [];
  cuts.push(cut);
  await AsyncStorage.setItem(CUTS_KEY, JSON.stringify(cuts));

  // Clears current transactions after the cut
  await AsyncStorage.removeItem(TRANSACTIONS_KEY);
}

/**
 * Gets all saved cuts.
 */
export async function getAllCuts(): Promise<Cut[]> {
  const stored = await AsyncStorage.getItem(CUTS_KEY);
  const rawCuts: Cut[] = stored ? JSON.parse(stored) : [];

  return rawCuts.map((cut) => ({
    ...cut,
    transactions: cut.transactions.map((t) => {
      return t.type === 'income'
        ? new Income(t.id, t.title, t.amount, t.date)
        : new Expense(t.id, t.title, t.amount, t.date);
    }),
  }));
}

/**
 * Gets a cut by ID.
 */
export async function getCutById(id: string): Promise<Cut | null> {
  const cuts = await getAllCuts();
  return cuts.find((c) => c.id === id) || null;
}

/**
 * Calculates the financial performance for the last 12 months.
 */
export async function getMonthlyPerformance(): Promise<MonthPerformance[]> {
  const cuts = await getAllCuts();
  const sorted = cuts.sort((a, b) => {
    const da = new Date(a.createdAt);
    const db = new Date(b.createdAt);
    return db.getTime() - da.getTime();
  });

  const last12 = sorted.slice(0, 12).reverse();

  return last12.map((cut) => ({
    month: cut.month,
    year: cut.year,
    balance: cut.balance,
  }));
}

/**
 * Inserts mock transaction data into local storage.
 */
export async function insertMockData() {
  const mockTransactions: Transaction[] = [
    TransactionFactory.createTransaction('income', 't1', 'Salary', 6000, new Date().toISOString()),
    TransactionFactory.createTransaction('income', 't2', 'Online Sale', 1200, new Date().toISOString()),
    TransactionFactory.createTransaction('expense', 't3', 'Supermarket', 800, new Date().toISOString()),
    TransactionFactory.createTransaction('expense', 't4', 'Netflix', 200, new Date().toISOString())
  ];

  await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(mockTransactions));
  console.log('Mock transactions inserted.');
}



/**
 * Inserts mock monthly cut data into local storage.
 * This is useful for populating the history.
 */
export async function insertMockCuts() {
  const existingCuts: Cut[] = await getAllCuts();

  const mockCuts: Cut[] = [
    {
      id: 'cut-2025-02',
      month: 2, // February
      year: 2025,
      balance: 1500, 
      createdAt: new Date('2025-02-28T23:59:59Z').toISOString(),
      transactions: [ 
        TransactionFactory.createTransaction('income', 'feb-t1', 'February Salary', 5000, '2025-02-15T10:00:00Z'),
        TransactionFactory.createTransaction('expense', 'feb-t2', 'February Rent', 3500, '2025-02-01T09:00:00Z'),
      ],
    },
    {
      id: 'cut-2025-03',
      month: 3, // March
      year: 2025,
      balance: 2800, 
      createdAt: new Date('2025-03-31T23:59:59Z').toISOString(),
      transactions: [
        TransactionFactory.createTransaction('income', 'mar-t1', 'March Salary', 5500, '2025-03-15T10:00:00Z'),
        TransactionFactory.createTransaction('expense', 'mar-t2', 'March Groceries', 1200, '2025-03-10T11:00:00Z'),
        TransactionFactory.createTransaction('expense', 'mar-t3', 'March Transport', 500, '2025-03-20T14:00:00Z'),
      ],
    },
    {
      id: 'cut-2025-04',
      month: 4, // April
      year: 2025,
      balance: 950, 
      createdAt: new Date('2025-04-30T23:59:59Z').toISOString(),
      transactions: [
        TransactionFactory.createTransaction('income', 'abr-t1', 'April Extra Sale', 1000, '2025-04-05T12:00:00Z'),
        TransactionFactory.createTransaction('expense', 'abr-t2', 'April Repair', 2000, '2025-04-12T16:00:00Z'),
      ],
    },
    {
      id: 'cut-2024-12', // May 2025 (as an example for the current month)
      month: 12,
      year: 2024,
      balance: 2500,
      createdAt: new Date('2024-12-26T10:00:00Z').toISOString(), // Current date/time example
      transactions: [
        TransactionFactory.createTransaction('income', 'may-t1', 'May Salary', 6000, '2025-05-15T10:00:00Z'),
        TransactionFactory.createTransaction('expense', 'may-t2', 'Various May Expenses', 3500, '2025-05-20T11:00:00Z'),
      ],
    }
  ];

  // Filters to prevent duplicates if cuts with those IDs already exist
  const cutsToSave = mockCuts.filter(mockCut => 
    !existingCuts.some(existingCut => existingCut.id === mockCut.id)
  );

  if (cutsToSave.length > 0) {
    const updatedCuts = [...existingCuts, ...cutsToSave];
    await AsyncStorage.setItem(CUTS_KEY, JSON.stringify(updatedCuts));
    console.log(`Inserted ${cutsToSave.length} mock cuts.`);
  } else {
    console.log('All mock cuts already exist or no new ones to insert.');
  }
}