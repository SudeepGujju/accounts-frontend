import { BankTransaction } from '../../models';
import { api } from '../../services';
import { BANK_TRANSACTION_URL } from '../endpoints';

export function getBankTransactionList(query: object){
    return api.get<BankTransaction[]>(`${BANK_TRANSACTION_URL}${ query ? '?'+(new URLSearchParams( [...Object.entries(query).filter( (f, i) => f[1]  )] )) : ''  }`);
}

export function getBankTransaction(bankTransactionID: string){
    return api.get<BankTransaction>(BANK_TRANSACTION_URL+"/"+bankTransactionID);
}

export function createBankTransaction(bankTransaction: BankTransaction){
    return api.post<{msg: string, id: string}>(BANK_TRANSACTION_URL, bankTransaction, {headers: {'responseType': 'text'}});
}

export function updateBankTransaction(bankTransaction: BankTransaction, transactionID: string){
    return api.put(BANK_TRANSACTION_URL+"/"+transactionID, bankTransaction, {headers: {'responseType': 'text'}});
}

export function deleteBankTransaction(bankTransactionID: string){
    return api.delete(BANK_TRANSACTION_URL+"/"+bankTransactionID, {headers: {'responseType': 'text'}});
}