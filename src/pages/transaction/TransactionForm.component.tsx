import React, { useContext, useEffect, useRef, useState } from 'react';
import { Account, Transaction } from '../../models';

import { FormikHelpers, FormikProps, useFormik } from "formik";
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { createTransaction, getTransaction, getAccountDropdownList, updateTransaction } from '../../api';
import { ALERT_TYPE, showAlert } from '../../services';
import { customFocusField, eventBus, formatAmount, formatDate } from '../../utils';
import { TRANSACTION_LIST_REFRESH_EVENT } from '../../constants';
import { AppContext, UserContext } from '../../context';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


function TransactionFormComponent() {

  const params = useParams();
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(true);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
  const [disableTrnxMainFld, setDisableTrnxMainFld] = useState<boolean>(false);
  const [accountList, setAccountList] = useState<Account[]>([]);
  const appCtx = useContext(AppContext);
  const userCtx = useContext(UserContext);
  const [entryList, setEntryList] = useState<Transaction[]>([]);
  const fromAccRef = useRef<any>();
  const trnxDateRef = useRef<any>();
  const toAccRef = useRef<any>();

  const transactionMinDate = userCtx?.user?.finYearStart ? new Date(userCtx?.user?.finYearStart): undefined;
  const transactionMaxDate = userCtx?.user?.finYearEnd ? new Date(userCtx?.user?.finYearEnd): undefined;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const transactionForm: FormikProps<Transaction> = useFormik<Transaction>({
    initialValues: {
      _id: "",
      trnxDate: currentDate,
      fromAcc: undefined,
      toAcc: undefined,
      desc: "",
      rno: "",
      received: 0.00,
      paid: 0.00
    },
    initialTouched: {
      trnxDate: true
    },
    validationSchema: yup.object().shape({
      trnxDate: yup.date().nullable().required('Transaction Date is required'),
      fromAcc: yup.string().required('From account is requried'),
      toAcc: yup.string().required('To account is requried').notOneOf([yup.ref('fromAcc')], 'To and From Account cannot be same'),
      desc: yup.string().required('Description is required'),
      rno: yup.string(),
      received: yup.number().nullable(),
      paid: yup.number().nullable(),
    }
    //   received: yup.number().nullable().when('paid', {
    //     is: (paidValue: any) => {
    //       console.log(`paidValue > ${paidValue} > ${paidValue == null || paidValue == undefined || paidValue == 0}`);
    //       if(paidValue == null || paidValue == undefined || paidValue == 0 ){ return true; }
    //       return false;
    //     },
    //     then: yup.number().moreThan(0, "Received or Paid amount must be more than 0").required("Received or Paid amount must be more than 0").nullable(),
    //     otherwise: yup.number().nullable()
    //   }),
    //   paid: yup.number().nullable().when('received', {
    //     is: (receivedValue: any) => {
    //       console.log(`receivedValue > ${receivedValue} > ${receivedValue == null || receivedValue == undefined || receivedValue == 0}`); 
    //       if(receivedValue == null || receivedValue == undefined || receivedValue == 0 ){ return true; }
    //       return false;
    //     },
    //     then: yup.number().moreThan(0, "Received or Paid amount must be more than 0").required("Received or Paid amount must be more than 0").nullable(),
    //     otherwise: yup.number().nullable()
    //   }),
    // },
    // [
    //   ['received', 'paid'],
    //   ['paid', 'received']
    // ]
    )
    .test(function(value, context){

      if(value.paid && value.received){
        const error =[];
        error.push(context.createError({message: "Should not enter both paid and received amounts", path: "received"}))
        error.push(context.createError({message: "Should not enter both paid and received amounts", path: "paid"}))
        return new yup.ValidationError(error);
      }

      if(!value.paid && !value.received){
        const error =[];
        error.push(context.createError({message: "Received or Paid amount must be more than 0", path: "received"}))
        error.push(context.createError({message: "Received or Paid amount must be more than 0", path: "paid"}))
        return new yup.ValidationError(error);
      }

      return true;
    }),
    onSubmit: async (data: Transaction, {setErrors}: FormikHelpers<Transaction>) => {

      appCtx?.setDisplayLoader(true);

      const transaction: any = Object.assign({}, data);

      transaction.paid = transaction.paid || 0;
      transaction.received = transaction.received || 0;

      try{

        let response;

        if(isCreateMode){

          delete transaction._id;

          response = await createTransaction(transaction);

          appCtx?.setDisplayLoader(false);

        }else{

          const id = transaction._id;

          delete transaction._id;

          response = await updateTransaction(transaction, id);

          appCtx?.setDisplayLoader(false);

          const alertConfig = {title: 'Success', message: response.data.msg, type: ALERT_TYPE.SUCCESS, onClose: () => {
            closeDialog(true);
          }};
          showAlert(alertConfig);

          return;
        }

        transaction._id = response.data.id;

        setEntryList( (prevState: Transaction[]) => { return ([] as Transaction[]).concat(prevState).concat( [transaction] ) } );

        clearFieldValues(transaction);

      }catch(e: any){

        appCtx?.setDisplayLoader(false);

        const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
        showAlert(alertConfig);
      }

    }
  });

  useEffect( () => {
    
    const getAccountList = async () => {
  
      try {
        const response = await getAccountDropdownList();
        setAccountList(response.data);
      } catch (e) {
        setAccountList([]);
      }
    }

    getAccountList();

  }, []);

  useEffect(() => {

    if(!params.id)
    {
      setIsCreateMode(true);
      return;
    }

    setIsCreateMode(false);

    const getTransactionInfo = async () => {
      try {
        const response = await getTransaction(params.id as string);

        transactionForm.setValues( {...response.data, trnxDate: (new Date(response.data.trnxDate))} );

        setDisableTrnxMainFld(true);
  
      } catch (e) {
        const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
        showAlert(alertConfig);
      }
    }

    getTransactionInfo();

  }, [params.id, transactionForm.setValues]);

  const closeDialog = (refresh?: boolean) => {

    refresh && eventBus.dispatch(TRANSACTION_LIST_REFRESH_EVENT);

    setVisible(false);
    navigate(-1);
  }

  const footer = (
      <div>
          <Button label="Close" icon="pi pi-times" onClick={() => closeDialog()} />
      </div>
  );

  const clearFieldValues = (data?: Transaction) => {

    const { _id, fromAcc, trnxDate } = data ?? transactionForm.values;

    transactionForm.resetForm({
      values: {
        _id: _id,
        trnxDate: trnxDate,
        fromAcc: fromAcc,
        toAcc: undefined,
        desc: "",
        rno: "",
        received: 0.00,
        paid: 0.00
      },
      touched: {
        trnxDate: true,
        fromAcc: true
      }
    });

    customFocusField(fromAccRef);
  }

  const isFormFieldValid = (name: keyof Transaction) => !!(transactionForm.touched[name] && transactionForm.errors[name]);

  const getFormErrorMessage = (name: keyof Transaction) => {
    return isFormFieldValid(name) && <small className="p-error">{transactionForm.errors[name]}</small>;
  };

  const selectedAccountTemplate = function(option:any, props:any){

    if (option) {
      return <span>{option.code + " - " + option.firmName}</span>
    }

    return (
        <span>
            {props.placeholder}
        </span>
    );

  }

  const optionAccountTemplate = function(option: any){
    return (
        <span>{option.code + " - " + option.firmName}</span>
    );
  }

  const disableAddTrnxBtn = ( ) => {

    if( !transactionForm.touched['trnxDate'] || !transactionForm.touched['fromAcc'] ){
      return true;
    }

    if(transactionForm.errors['trnxDate'] || transactionForm.errors['fromAcc']){
      return true;
    }

    return false;
  }

  const formatTransactionAmount = (rowData: Transaction, field: 'received'|'paid') => {
    return formatAmount(rowData[field]);
  }

  const formatTransactionDate = (rowData: Transaction,) => {
    return formatDate(new Date(rowData.trnxDate));
  }

  function disableTrnxField(){
    setDisableTrnxMainFld( (prevState) => !prevState );
  }

  return (
    <Dialog visible={visible} modal closeOnEscape={false} header={`Transaction - ${isCreateMode ? 'Create' : 'Edit' }`} footer={footer} onHide={ closeDialog } style={{'width': '100vw', 'height': '100vh'}} blockScroll={true}>
        <div className="p-2">
          <form className="p-fluid">
            <div className="flex gap-4 mb-6">
              <div className="field">
                  <label htmlFor="trnxDate" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Transaction Date</label>
                  <Calendar name="trnxDate" id="trnxDate" value={transactionForm.values.trnxDate} onChange={ (e) => { transactionForm.setFieldValue('trnxDate', e.target.value) } } onSelect={ () => { customFocusField(fromAccRef); } } onBlur={transactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('trnxDate'), 'p-inputtext-sm': true })} placeholder="Trnx. Date" required disabled={!isCreateMode || disableTrnxMainFld}
                    dateFormat="dd/mm/yy" minDate={transactionMinDate} maxDate={transactionMaxDate} monthNavigator yearNavigator yearRange={`${ transactionMinDate?.getFullYear() }:${transactionMaxDate?.getFullYear()}`} mask="99/99/9999"
                    showOnFocus={false}
                  />
                  {getFormErrorMessage('trnxDate')}
              </div>
              <div className="field w-1/4 max-w-1/4">
                <label htmlFor="fromAcc" className="block mb-2"><span className='text-[#e24c4c]'>*</span>From Account</label>
                <Dropdown inputId='fromAcc' id="fromAcc" name='fromAcc' options={accountList} optionLabel="firmName" optionValue="code" value={transactionForm.values.fromAcc} filter showClear filterBy="code,firmName" filterPlaceholder="Search group code or name" onChange={(e) => { transactionForm.setFieldValue("fromAcc", e.value) }} onBlur={transactionForm.handleBlur} placeholder='Select Account'
                  valueTemplate={selectedAccountTemplate} itemTemplate={optionAccountTemplate} required className={classNames({ 'p-invalid': isFormFieldValid('fromAcc'), 'p-inputtext-sm': true })} style={{"width": "100%"}} disabled={!isCreateMode || disableTrnxMainFld} resetFilterOnHide={true}
                  ref={fromAccRef}>
                </Dropdown>
                {getFormErrorMessage('fromAcc')}
              </div>
              <div className="field">
                <label className="block invisible">.</label>
                { !disableTrnxMainFld && <Button type='button' label="Add Transaction" onClick={() => { disableTrnxField(); customFocusField(toAccRef); } } className="w-1/2" disabled={ disableAddTrnxBtn() } /> }
                { disableTrnxMainFld && <Button type='button' label="Change Account" onClick={ () => { disableTrnxField(); clearFieldValues(); } } className="w-1/2" /> }
              </div>
            </div>
            {
              <div className="flex gap-2 mb-3">
                <div className="field w-1/4 max-w-1/4">
                  <label htmlFor="toAcc" className="block mb-2"><span className='text-[#e24c4c]'>*</span>To Account</label>
                  <Dropdown inputId='toAcc' id="toAcc" name='toAcc' options={accountList} optionLabel="firmName" optionValue="code" value={transactionForm.values.toAcc} filter showClear filterBy="code,firmName" filterPlaceholder="Search group code or name" onChange={(e) => { transactionForm.setFieldValue("toAcc", e.value) }} onBlur={transactionForm.handleBlur} placeholder='Select Account'
                    valueTemplate={selectedAccountTemplate} itemTemplate={optionAccountTemplate} required className={classNames({ 'p-invalid': isFormFieldValid('toAcc'), 'p-inputtext-sm': true })} style={{"width": "100%"}} disabled={!isCreateMode || !disableTrnxMainFld} resetFilterOnHide={true}
                    ref={toAccRef}>
                  </Dropdown>
                  {getFormErrorMessage('toAcc')}
                </div>
                <div className="field w-1/6">
                  <label htmlFor="desc" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Description</label>
                  <InputText type="text" name="desc" id="desc" value={transactionForm.values.desc} onChange={transactionForm.handleChange} onBlur={transactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('desc'), 'p-inputtext-sm': true })} placeholder="Description" required maxLength={10} disabled={!disableTrnxMainFld}/>
                  {getFormErrorMessage('desc')}
                </div>
                <div className="field w-1/6">
                  <label htmlFor="rno" className="block mb-2">Receipt No</label>
                  <InputText type="text" name="rno" id="rno" value={transactionForm.values.rno} onChange={transactionForm.handleChange} onBlur={transactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('rno'), 'p-inputtext-sm': true })} placeholder="Receipt No" maxLength={10} disabled={!disableTrnxMainFld}/>
                  {getFormErrorMessage('rno')}
                </div>
                <div className="field w-1/6">
                  <label htmlFor="received" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Received Amount</label>
                  <InputNumber id="received" name="received" value={transactionForm.values.received} onValueChange={transactionForm.handleChange} onBlur={transactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('received'), 'p-inputtext-sm': true })} placeholder="Received Amount" mode="decimal" maxFractionDigits={2} min={0} max={10000000} locale="en-IN" required disabled={!disableTrnxMainFld}/>
                  {getFormErrorMessage('received')}
                </div>
                <div className="field w-1/6">
                  <label htmlFor="paid" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Paid Amount</label>
                  <InputNumber id="paid" name="paid" value={transactionForm.values.paid} onValueChange={transactionForm.handleChange} onBlur={transactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('paid'), 'p-inputtext-sm': true })} placeholder="Paid Amount" mode="decimal" maxFractionDigits={2} min={0} max={10000000} locale="en-IN" required disabled={!disableTrnxMainFld}/>
                  {getFormErrorMessage('paid')}
                </div>
                <div className='field'>
                  <label className="block invisible">.</label>
                  <Button type="button" label="Save" icon="pi pi-save" onClick={transactionForm.submitForm} />
                </div>
              </div>
            }
          </form>
          {
            entryList.length > 0 && (
              <div>
                <DataTable value={entryList}
                size="small"
                responsiveLayout="scroll"
                showGridlines
                scrollable
                scrollHeight="35vh"
                stripedRows
                >
                  <Column field="trnxDate" header="Trnx. Date" body={formatTransactionDate}></Column>
                  <Column field="fromAcc" header="From Acc"></Column>
                  <Column field="toAcc" header="To Acc"></Column>
                  <Column field="desc" header="Description"></Column>
                  <Column field="rno" header="Receipt"></Column>
                  <Column
                    field="received"
                    header="Received"
                    align="right"
                    alignHeader="left"
                    body={(rowData) => { return formatTransactionAmount(rowData, "received") }}
                  ></Column>
                  <Column
                    field="paid"
                    header="Paid"
                    align="right"
                    alignHeader="left"
                    body={(rowData) => { return formatTransactionAmount(rowData, "paid") }}
                  ></Column>
                </DataTable>
              </div>
            )
          }
        </div>
    </Dialog>
  )
}

export default TransactionFormComponent;