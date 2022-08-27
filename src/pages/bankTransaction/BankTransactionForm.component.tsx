import React, { MutableRefObject, Ref, useContext, useEffect, useRef, useState } from 'react';
import { Account, BankTransaction } from '../../models';

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
import { createBankTransaction, getBankTransaction, getAccountDropdownList, updateBankTransaction } from '../../api';
import { ALERT_TYPE, showAlert } from '../../services';
import { eventBus, formatAmount, formatDate } from '../../utils';
import { BANK_TRANSACTION_LIST_REFRESH_EVENT } from '../../constants';
import { AppContext, UserContext } from '../../context';
import { customFocusField } from '../../utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


function BankTransactionFormComponent() {

  const params = useParams();
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(true);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
  // const [disableTrnxMainFld, setDisableTrnxMainFld] = useState<boolean>(false);
  const [accountList, setAccountList] = useState<Account[]>([]);
  const appCtx = useContext(AppContext);
  const userCtx = useContext(UserContext);
  const [entryList, setEntryList] = useState<BankTransaction[]>([]);
  const fromAccRef = useRef<any>();
  const trnxDateRef = useRef<any>();
  const toAccRef = useRef<any>();

  const transactionMinDate = userCtx?.user?.finYearStart ? new Date(userCtx?.user?.finYearStart): undefined;
  const transactionMaxDate = userCtx?.user?.finYearEnd ? new Date(userCtx?.user?.finYearEnd): undefined;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const bankTransactionForm: FormikProps<BankTransaction> = useFormik<BankTransaction>({
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
    onSubmit: async (data: BankTransaction, {setErrors}: FormikHelpers<BankTransaction>) => {

      appCtx?.setDisplayLoader(true);

      const transaction: any = Object.assign({}, data);

      transaction.paid = transaction.paid || 0;
      transaction.received = transaction.received || 0;

      try{

        let response;

        if(isCreateMode){

          delete transaction._id;

          response = await createBankTransaction(transaction);

          appCtx?.setDisplayLoader(false);

        }else{

          const id = transaction._id;

          delete transaction._id;

          response = await updateBankTransaction(transaction, id);

          appCtx?.setDisplayLoader(false);

          const alertConfig = {title: 'Success', message: response.data.msg, type: ALERT_TYPE.SUCCESS, onClose: () => {
            closeDialog(true);
          }};
          showAlert(alertConfig);

          return;
        }

        transaction._id = response.data.id;

        setEntryList( (prevState: BankTransaction[]) => { return ([] as BankTransaction[]).concat(prevState).concat( [transaction] ) } );

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

    const getBankTransactionInfo = async () => {
      try {
        const response = await getBankTransaction(params.id as string);

        bankTransactionForm.setValues( {...response.data, trnxDate: (new Date(response.data.trnxDate))} );

        // setDisableTrnxMainFld(true);
  
      } catch (e) {
        const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
        showAlert(alertConfig);
      }
    }

    getBankTransactionInfo();

  }, [params.id, bankTransactionForm.setValues]);

  const closeDialog = (refresh?: boolean) => {

    refresh && eventBus.dispatch(BANK_TRANSACTION_LIST_REFRESH_EVENT);

    setVisible(false);
    navigate(-1);
  }

  const footer = (
      <div>
          <Button label="Close" icon="pi pi-times" onClick={() => closeDialog()} />
      </div>
  );

  const clearFieldValues = (data?: BankTransaction) => {

    const { _id, fromAcc, trnxDate } = data ?? bankTransactionForm.values;

    bankTransactionForm.resetForm({
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

  const isFormFieldValid = (name: keyof BankTransaction) => !!(bankTransactionForm.touched[name] && bankTransactionForm.errors[name]);

  const getFormErrorMessage = (name: keyof BankTransaction) => {
    return isFormFieldValid(name) && <small className="p-error">{bankTransactionForm.errors[name]}</small>;
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

  // const disableAddTrnxBtn = ( ) => {

  //   if( !bankTransactionForm.touched['fromAcc'] ){
  //     return true;
  //   }

  //   if(bankTransactionForm.errors['fromAcc']){
  //     return true;
  //   }

  //   return false;
  // }

  const formatTransactionAmount = (rowData: BankTransaction, field: 'received'|'paid') => {
    return formatAmount(rowData[field]);
  }

  const formatTransactionDate = (rowData: BankTransaction,) => {
    return formatDate(new Date(rowData.trnxDate));
  }

  // function disableTrnxField(){
  //   setDisableTrnxMainFld( (prevState) => !prevState );
  // }

  return (
    <Dialog visible={visible} modal closeOnEscape={false} header={`Bank Transaction - ${isCreateMode ? 'Create' : 'Edit' }`} footer={footer} onHide={ closeDialog } style={{'width': '100vw', 'height': '100vh'}} blockScroll={true}>
        <div className="p-2">
          <form className="p-fluid">
            {/* <div className="flex gap-4 mb-6">
              <div className="field self-center">
                <label htmlFor="fromAcc" className="block mb-2"><span className='text-[#e24c4c]'>*</span>From Account</label>
              </div>
              <div className="field w-1/4 max-w-1/4">
                <Dropdown inputId='fromAcc' id="fromAcc" name='fromAcc' options={accountList} optionLabel="firmName" optionValue="code" value={bankTransactionForm.values.fromAcc} filter showClear filterBy="code,firmName" filterPlaceholder="Search group code or name" onChange={(e) => { bankTransactionForm.setFieldValue("fromAcc", e.value) }} onBlur={bankTransactionForm.handleBlur} placeholder='Select Account'
                 valueTemplate={selectedAccountTemplate} itemTemplate={optionAccountTemplate} required className={classNames({ 'p-invalid': isFormFieldValid('fromAcc'), 'p-inputtext-sm': true })} style={{"width": "100%"}} disabled={!isCreateMode || disableTrnxMainFld} resetFilterOnHide={true} 
                 ref={fromAccRef} autoFocus >
                </Dropdown>
                {getFormErrorMessage('fromAcc')}
              </div>
              <div className="field">
                { !disableTrnxMainFld && <Button type='button' id="addTrnxBtn" label="Add Transaction" onClick={() => { disableTrnxField(); customFocusField(trnxDateRef); } } className="w-1/2" disabled={ disableAddTrnxBtn() } /> }
                { disableTrnxMainFld && <Button type='button' id="changeTrnxBtn" label="Change Account" onClick={ () => { disableTrnxField(); clearFieldValues(); } } className="w-1/2" /> }
              </div>
            </div> */}
            <div className="flex gap-2 mb-3">
              <div className="field w-56">
                <label htmlFor="fromAcc" className="block mb-2"><span className='text-[#e24c4c]'>*</span>From Account</label>
                <Dropdown inputId='fromAcc' id="fromAcc" name='fromAcc' options={accountList} optionLabel="firmName" optionValue="code" value={bankTransactionForm.values.fromAcc} filter showClear filterBy="code,firmName" filterPlaceholder="Search group code or name" onChange={(e) => { bankTransactionForm.setFieldValue("fromAcc", e.value) }} onBlur={bankTransactionForm.handleBlur} placeholder='Select Account'
                 valueTemplate={selectedAccountTemplate} itemTemplate={optionAccountTemplate} required className={classNames({ 'p-invalid': isFormFieldValid('fromAcc'), 'p-inputtext-sm': true })} style={{"width": "100%"}} disabled={!isCreateMode} resetFilterOnHide={true} 
                 ref={fromAccRef} autoFocus >
                </Dropdown>
                {getFormErrorMessage('fromAcc')}
              </div>
              <div className="field w-56">
                  <label htmlFor="trnxDate" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Date</label>
                  <Calendar name="trnxDate" id="trnxDate" value={bankTransactionForm.values.trnxDate} onChange={ (e) => { bankTransactionForm.setFieldValue('trnxDate', e.target.value); } } onSelect={ () => { customFocusField(toAccRef); } } onBlur={bankTransactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('trnxDate'), 'p-inputtext-sm': true })} placeholder="Trnx. Date" required
                    dateFormat="dd/mm/yy" minDate={transactionMinDate} maxDate={transactionMaxDate} monthNavigator yearNavigator yearRange={`${ transactionMinDate?.getFullYear() }:${transactionMaxDate?.getFullYear()}`} mask="99/99/9999"
                    ref={trnxDateRef} showOnFocus={false}
                  />
                  {getFormErrorMessage('trnxDate')}
              </div>
              <div className="field w-56">
                <label htmlFor="toAcc" className="block mb-2"><span className='text-[#e24c4c]'>*</span>To Account</label>
                <Dropdown inputId='toAcc' id="toAcc" name='toAcc' options={accountList} optionLabel="firmName" optionValue="code" value={bankTransactionForm.values.toAcc} filter showClear filterBy="code,firmName" filterPlaceholder="Search group code or name" onChange={(e) => { bankTransactionForm.setFieldValue("toAcc", e.value) }} onBlur={bankTransactionForm.handleBlur} placeholder='Select Account'
                  valueTemplate={selectedAccountTemplate} itemTemplate={optionAccountTemplate} required className={classNames({ 'p-invalid': isFormFieldValid('toAcc'), 'p-inputtext-sm': true })} style={{"width": "100%"}} resetFilterOnHide={true}
                  ref={toAccRef}>
                </Dropdown>
                {getFormErrorMessage('toAcc')}
              </div>
              <div className="field w-56">
                <label htmlFor="desc" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Description</label>
                <InputText type="text" name="desc" id="desc" value={bankTransactionForm.values.desc} onChange={bankTransactionForm.handleChange} onBlur={bankTransactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('desc'), 'p-inputtext-sm': true })} placeholder="Description" required maxLength={10} />
                {getFormErrorMessage('desc')}
              </div>
              <div className="field w-56">
                <label htmlFor="rno" className="block mb-2">Receipt No</label>
                <InputText type="text" name="rno" id="rno" value={bankTransactionForm.values.rno} onChange={bankTransactionForm.handleChange} onBlur={bankTransactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('rno'), 'p-inputtext-sm': true })} placeholder="Receipt No" maxLength={10}/>
                {getFormErrorMessage('rno')}
              </div>
              <div className="field w-40">
                <label htmlFor="received" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Received Amount</label>
                <InputNumber id="received" name="received" value={bankTransactionForm.values.received} onValueChange={bankTransactionForm.handleChange} onBlur={bankTransactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('received'), 'p-inputtext-sm': true })} placeholder="Received Amount" mode="decimal" maxFractionDigits={2} min={0} max={10000000} locale="en-IN" required/>
                {getFormErrorMessage('received')}
              </div>
              <div className="field w-40">
                <label htmlFor="paid" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Paid Amount</label>
                <InputNumber id="paid" name="paid" value={bankTransactionForm.values.paid} onValueChange={bankTransactionForm.handleChange} onBlur={bankTransactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('paid'), 'p-inputtext-sm': true })} placeholder="Paid Amount" mode="decimal" maxFractionDigits={2} min={0} max={10000000} locale="en-IN" required/>
                {getFormErrorMessage('paid')}
              </div>
              <div className='field w-32'>
                <label className="block invisible">.</label>
                <Button type="button" label="Save" icon="pi pi-save" onClick={bankTransactionForm.submitForm}/>
              </div>
            </div>
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
                  <Column field="fromAcc" header="From Acc"></Column>
                  <Column field="trnxDate" header="Trnx. Date" body={formatTransactionDate}></Column>
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

export default BankTransactionFormComponent;