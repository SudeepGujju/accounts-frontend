export type Invoice = {
    _id: string,
    invcType: InvoiceType;
    invcTypeName?: string;
    invcNo: string;
    invcDate: Date;
    cr: string;
    code: string;
    name: string;
    town: string;
    gst: string;
    invcAmt: number;
    taxAmt: number;
    gstAmt: number;
    remarks: string;
    month: string;
    st: string;
    amt5:number;
    amt12:number;
    amt18:number;
    amt28:number;
    amt0:number;
    igst:number;
    cgst:number;
    sgst:number;
}

export enum InvoiceType {
    Sales = 1,
    Purchase = 2,
    CRN_SR = 3,
    DBN_PR = 4
}

export const INVOICE_TYPE_NAME_SALES = "Sales";
export const INVOICE_TYPE_NAME_PURCHASE = "Purchase";
export const INVOICE_TYPE_NAME_CRN_SR = "CRN/SR";
export const INVOICE_TYPE_NAME_DBN_PR = "DBN/PR";

export const getInvoiceName = (invcType: number) => {

    switch (invcType) {
        case InvoiceType.Sales: return INVOICE_TYPE_NAME_SALES;
        case InvoiceType.Purchase: return INVOICE_TYPE_NAME_PURCHASE;
        case InvoiceType.CRN_SR: return INVOICE_TYPE_NAME_CRN_SR;
        case InvoiceType.DBN_PR: return INVOICE_TYPE_NAME_DBN_PR;
        default: return;
    }

}

export const invoiceTypes = [
    { label: INVOICE_TYPE_NAME_PURCHASE, value: InvoiceType.Purchase },
    { label: INVOICE_TYPE_NAME_SALES, value: InvoiceType.Sales },
    { label: INVOICE_TYPE_NAME_CRN_SR, value: InvoiceType.CRN_SR },
    { label: INVOICE_TYPE_NAME_DBN_PR, value: InvoiceType.DBN_PR },
]