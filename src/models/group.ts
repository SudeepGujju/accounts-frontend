export type Group = {
    _id: string,
    code: string;
    name: string;
    grpType: GroupType;
    groupName?: string;
}

export enum GroupType {
    Trading = 1,
    ProfitAndLoss = 2,
    BalanceSheet = 3
}

export const GROUP_TYPE_NAME_TRADING = "Trading";
export const GROUP_TYPE_NAME_PROFIT_AND_LOSS = "Profit And Loss";
export const GROUP_TYPE_NAME_BALANCE_SHEET = "Balance Sheet";

export const getGroupName = (grpType: number) => {

    switch(grpType){
        case GroupType.Trading: return GROUP_TYPE_NAME_TRADING;
        case GroupType.ProfitAndLoss: return GROUP_TYPE_NAME_PROFIT_AND_LOSS;
        case GroupType.BalanceSheet: return GROUP_TYPE_NAME_BALANCE_SHEET;
        default: return;
    }

}