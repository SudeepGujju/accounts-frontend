import { Group } from '../../models';
import { api } from '../../services';
import { GROUP_DROPDOWN_URL, GROUP_URL } from '../endpoints';

export function getGroupList(){
    return api.get<Group[]>(GROUP_URL);
}

export function getGroup(groupID: string){
    return api.get<Group>(GROUP_URL+"/"+groupID);
}

export function createGroup(group: Group){
    return api.post(GROUP_URL, group, {headers: {'responseType': 'text'}});
}

export function updateGroup(group: Group, groupID: string){
    return api.put(GROUP_URL+"/"+groupID, group, {headers: {'responseType': 'text'}});
}

export function deleteGroup(groupID: string){
    return api.delete(GROUP_URL+"/"+groupID, {headers: {'responseType': 'text'}});
}

export function getGroupDropdownList(){
    return api.get<Group[]>(GROUP_DROPDOWN_URL);
}