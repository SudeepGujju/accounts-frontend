import { ACCOUNT_DOWNLOAD_SAMPLE_URL, ACCOUNT_UPLOAD_URL, BANK_TRANSACTION_DOWNLOAD_SAMPLE_URL, BANK_TRANSACTION_UPLOAD_URL, GROUP_DOWNLOAD_SAMPLE_URL, GROUP_UPLOAD_URL, INVOICE_DOWNLOAD_SAMPLE_URL, INVOICE_UPLOAD_URL, TRANSACTION_DOWNLOAD_SAMPLE_URL, TRANSACTION_UPLOAD_URL } from "../api/endpoints"

export const getUploadConfig = (type: string): { title: string, url: string, sampleFileUrl: string } => {

    if(type === 'group'){
        return {title: 'Group', url: GROUP_UPLOAD_URL, sampleFileUrl: GROUP_DOWNLOAD_SAMPLE_URL};
    }else if(type === 'account'){
        return {title: 'Account', url: ACCOUNT_UPLOAD_URL, sampleFileUrl: ACCOUNT_DOWNLOAD_SAMPLE_URL};
    }else if(type === 'transaction'){
        return {title: 'Tranasction', url: TRANSACTION_UPLOAD_URL, sampleFileUrl: TRANSACTION_DOWNLOAD_SAMPLE_URL};
    }else if(type === 'bank'){
        return {title: 'BankTranasction', url: BANK_TRANSACTION_UPLOAD_URL, sampleFileUrl: BANK_TRANSACTION_DOWNLOAD_SAMPLE_URL};
    }else if(type === 'invoice'){
        return {title: 'Invoice', url: INVOICE_UPLOAD_URL, sampleFileUrl: INVOICE_DOWNLOAD_SAMPLE_URL};
    }

    return { title: '', url: '', sampleFileUrl: ''};

}