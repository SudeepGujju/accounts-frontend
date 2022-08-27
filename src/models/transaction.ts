export type Transaction = {
    _id: string,
    fromAcc: string|undefined;
    toAcc: string|undefined;
    trnxDate: Date;
    desc: string;
    rno: string;
    received: number;
    paid: number;
}