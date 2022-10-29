import { Invoice } from '../../models';
import { api } from '../../services';
import { CUSTOMER_SALES_URL } from '../endpoints';

export function getSalesList(query: object){
    return api.get<Invoice[]>(`${CUSTOMER_SALES_URL}${ query ? '?'+(new URLSearchParams( [...Object.entries(query).filter( (f, i) => f[1] )] )) : ''  }`);
}

// export function getInvoice(invoiceID: string){
//     return api.get<Invoice>(INVOICE_URL+"/"+invoiceID);
// }

// export function createInvoice(invoice: Invoice){
//     return api.post(INVOICE_URL, invoice, {headers: {'responseType': 'text'}});
// }

// export function updateInvoice(invoice: Invoice, invoiceID: string){
//     return api.put(INVOICE_URL+"/"+invoiceID, invoice, {headers: {'responseType': 'text'}});
// }

// export function deleteInvoice(invoiceID: string){
//     return api.delete(INVOICE_URL+"/"+invoiceID, {headers: {'responseType': 'text'}});
// }