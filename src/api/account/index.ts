import { Account } from '../../models';
import { api } from '../../services';
import { ACCOUNT_DROPDOWN_URL, ACCOUNT_URL } from '../endpoints';

export function getAccountList(){
    return api.get<Account[]>(ACCOUNT_URL);
}

export function getAccount(accountID: string){
    return api.get<Account>(ACCOUNT_URL+"/"+accountID);
}

export function createAccount(account: Account){
    return api.post(ACCOUNT_URL, account, {headers: {'responseType': 'text'}});
}

export function updateAccount(account: Account, accountID: string){
    return api.put(ACCOUNT_URL+"/"+accountID, account, {headers: {'responseType': 'text'}});
}

export function deleteAccount(accountID: string){
    return api.delete(ACCOUNT_URL+"/"+accountID, {headers: {'responseType': 'text'}});
}

export function getAccountDropdownList(){
    return api.get<Account[]>(ACCOUNT_DROPDOWN_URL);
}