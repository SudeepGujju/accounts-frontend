import { User } from '../../models/';
import { api } from '../../services';
import { USER_URL, USER_DROPDOWN_URL } from '../endpoints';

export function getUserList(){
    return api.get<User[]>(USER_URL);
}

export function getUser(userID: string){
    return api.get<User>(USER_URL+"/"+userID);
}

export function createUser(user: User){
    return api.post(USER_URL, user, {headers: {'responseType': 'text'}});
}

export function updateUser(user: User, userID: string){
    return api.put(USER_URL+"/"+userID, user, {headers: {'responseType': 'text'}});
}

export function deleteUser(userID: string){
    return api.delete(USER_URL+"/"+userID, {headers: {'responseType': 'text'}});
}

export function getUserDropdownList(){
    return api.get<Partial<User>[]>(USER_DROPDOWN_URL);
}