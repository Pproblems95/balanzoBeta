export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    date: string;
    type: TransactionType
}

export class Income implements Transaction{
    id: string;
    title: string;
    amount: number;
    date: string;
    type: TransactionType = 'income';

    constructor(id: string, title: string, amount: number, date: string) {
    this.id = id;
    this.title = title;
    this.amount = amount;
    this.date = date;
    }
}

export class Expense implements Transaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: TransactionType = 'expense';

  constructor(id: string, title: string, amount: number, date: string) {
    this.id = id;
    this.title = title;
    this.amount = amount;
    this.date = date;
  }
}