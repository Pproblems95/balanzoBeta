import { Transaction } from "./Transaction";

export interface Cut {
    id: string;
    month: number;
    year: number;
    transactions: Transaction[];
    createdAt: string;
    balance: number;
}

export function calculateCutBalance(transactions: Transaction[]): number {
    return transactions.reduce((acc, t) => {
        return t.type === 'income'
            ? acc + t.amount 
            : acc - t.amount;
    }, 0);
}