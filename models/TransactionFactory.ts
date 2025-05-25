import {Income, Expense, Transaction, TransactionType } from './Transaction';

export class TransactionFactory {
    static createTransaction(
        type: TransactionType,
        id: string,
        title: string,
        amount: number,
        date: string
    ) : Transaction{
        if (type === 'income'){
            return new Income(id, title, amount, date);
        } else {
            return new Expense(id, title, amount, date);
        }
    }
}