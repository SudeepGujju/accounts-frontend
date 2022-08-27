import { Transaction } from '../../models';
import { api } from '../../services';
import { TRANSACTION_URL } from '../endpoints';

export function getTransactionList(query: object){
    return api.get<Transaction[]>(`${TRANSACTION_URL}${ query ? '?'+(new URLSearchParams( [...Object.entries(query).filter( (f, i) => f[1]  )] )) : ''  }`);
}

export function getTransaction(transactionID: string){
    return api.get<Transaction>(TRANSACTION_URL+"/"+transactionID);
}

export function createTransaction(transaction: Transaction){
    return api.post<{msg: string, id: string}>(TRANSACTION_URL, transaction, {headers: {'responseType': 'text'}});
}

export function updateTransaction(transaction: Transaction, transactionID: string){
    return api.put(TRANSACTION_URL+"/"+transactionID, transaction, {headers: {'responseType': 'text'}});
}

export function deleteTransaction(transactionID: string){
    return api.delete(TRANSACTION_URL+"/"+transactionID, {headers: {'responseType': 'text'}});
}