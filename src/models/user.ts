export type CurrentUser = {
    username: string,
    loginID: string,
    finYearStart: string,
    finYearEnd: string,
    _id: string,
    userType: UserType
};

export type CurrentUserToken = {
    accessToken: string,
    refreshToken: string,
}

export type User = {
    _id: string,
    username: string,
    loginID: string,
    finYear: string,
    phone: string,
    userType?: UserType,
    status: UserStatus,
    statusText?: string
};

export enum UserStatus {
    Active= 1,
    Inactive=2
}

export enum UserType {
    Admin= 1,
    User=2
}

export const USER_STATUS_ACTIVE = "Active";
export const USER_STATUS_INACTIVE = "Inactive";

export const getUserStatus = (userStatus: number) => {

    switch(userStatus){
        case UserStatus.Active: return USER_STATUS_ACTIVE;
        case UserStatus.Inactive: return USER_STATUS_INACTIVE;
        default: return;
    }

}