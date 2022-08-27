import { CurrentUser, CurrentUserToken } from '../../models';
import { api } from '../../services';
import { LOGIN_URL, LOGOUT_URL } from '../endpoints';

type User = {
    user: CurrentUser,
    tokens: CurrentUserToken
}

export function logoutUser(){
    return api.post(LOGOUT_URL);
}

export function loginUser(credentials: {loginID:string, password: string}){
    return api.post<User>(LOGIN_URL, credentials, {headers: {'Content-Type': 'application/json'}})
}