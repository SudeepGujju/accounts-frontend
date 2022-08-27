import React, { useContext, useEffect, useState } from 'react';
import { Account, Group } from '../../models';
import './AccountForm.component.css';

import { FormikHelpers, FormikProps, useFormik } from "formik";
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputMask } from 'primereact/inputmask';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { createAccount, getAccount, getGroupDropdownList, updateAccount } from '../../api';
import { ALERT_TYPE, showAlert } from '../../services';
import { eventBus } from '../../utils';
import { ACCOUNT_LIST_REFRESH_EVENT } from '../../constants';
import { AppContext } from '../../context';


function AccountFormComponent() {

  const params = useParams();
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(true);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
  const [groupList, setGroupList] = useState<Group[]>([]);
  const appCtx = useContext(AppContext);

  const accountForm: FormikProps<Account> = useFormik<Account>({
    initialValues: {
      _id: "",
      code: "",
      firmName: "",
      proprietor: "",
      phone: "",
      dno: "",
      strtNo: "",
      area: "",
      town: "",
      dl1: "",
      dl2: "",
      gst: "",
      mailid: "",
      opngBalAmt: 0.00,
      groupCode: undefined
    },
    validationSchema: yup.object({
      code: yup.string().max(10, 'Code must be 10 characters or less').required('Code is required'),
      firmName: yup.string().max(50, 'Firm Name must be 50 characters or less').required('FirmName is required'),
      proprietor: yup.string().max(50, 'Proprietor must be 50 characters or less'),
      phone: yup.string().min(10, 'Phone number must be 10 characters').max(10, 'Phone number must be 10 characters'),
      dno: yup.string().max(30, 'Dno must be 30 characters or less'),
      strtNo: yup.string().max(30, 'Street No. must be 30 characters or less'),
      area: yup.string().max(50, 'Area must be 50 characters or less'),
      town: yup.string().max(50, 'Town must be 50 characters or less'),
      dl1: yup.string().max(50, 'Drug License must be 50 characters or less'),
      dl2: yup.string().max(50, 'Drug License must be 50 characters or less'),
      gst: yup.string().min(2, 'GST must be 2 characters or more').max(50, 'GST must be 50 characters or less'),
      mailid: yup.string().email('Invalid Mail ID').max(50, 'Mail ID must be 50 characters or less'),
      opngBalAmt: yup.number().nullable().required('Opening balance is requried'),
      groupCode: yup.string().required('Group code is requried')
    }),
    onSubmit: async (data: Account, {setErrors}: FormikHelpers<Account>) => {

      appCtx?.setDisplayLoader(true);

      const account: any = Object.assign({}, data);

      try{

        let response;

        if(isCreateMode){

          delete account._id;

          response = await createAccount(account);

        }else{

          const id = account._id;

          delete account._id;

          response = await updateAccount(account, id);
        }

        appCtx?.setDisplayLoader(false);

        const alertConfig = {title: 'Success', message: response.data, type: ALERT_TYPE.SUCCESS, onClose: () => {
          closeDialog(true);
        }};
        showAlert(alertConfig);

      }catch(e: any){

        appCtx?.setDisplayLoader(false);

        if( typeof e == 'string' && e.includes("already exists")){
          setErrors({'code': 'Code already exists'});
        }else{
          const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
          showAlert(alertConfig);
        }

      }

    }
  });

  useEffect( () => {
    
    const groupList = async () => {
  
      try {
        const response = await getGroupDropdownList();
        setGroupList(response.data);
      } catch (e) {
        setGroupList([]);
      }
    }

    groupList();

  }, [])

  useEffect(() => {

    if(!params.id)
    {
      setIsCreateMode(true);
      return;
    }

    setIsCreateMode(false);

    const getAccountInfo = async () => {
      try {
        const response = await getAccount(params.id as string);

        accountForm.setValues( response.data )
  
      } catch (e) {
        const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
        showAlert(alertConfig);
      }
    }

    getAccountInfo();

  }, [params.id]);

  const closeDialog = (refresh?: boolean) => {
    
    refresh && eventBus.dispatch(ACCOUNT_LIST_REFRESH_EVENT);

    setVisible(false);
    navigate(-1);
  }

  const footer = (
      <div>
          <Button label="Close" icon="pi pi-times" onClick={() => closeDialog()} />
          <Button type="button" label="Save" icon="pi pi-save" onClick={accountForm.submitForm} disabled={!accountForm.isValid} />
      </div>
  );

  const isFormFieldValid = (name: keyof Account) => !!(accountForm.touched[name] && accountForm.errors[name]);

  const getFormErrorMessage = (name: keyof Account) => {
    return isFormFieldValid(name) && <small className="p-error">{accountForm.errors[name]}</small>;
  };

  const selectedGroupTemplate = function(option:any, props:any){

    if (option) {
      return <span>{option.code + " - " + option.name}</span>
    }

    return (
        <span>
            {props.placeholder}
        </span>
    );

  }

  const optionGroupTemplate = function(option: any){
    return (
        <span>{option.code + " - " + option.name}</span>
    );
  }

  return (
    <Dialog visible={visible} modal closeOnEscape={false} header={`Account - ${isCreateMode ? 'Create' : 'Edit' }`} footer={footer} onHide={ closeDialog } style={{'width': '50%'}} blockScroll={true}>
        <div className="p-2">
          <form className="p-fluid">
            <div className="flex justify-between gap-4">
              <div className="field mb-6 w-1/2">
                  <label htmlFor="code" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Code</label>
                  <InputText type="text" name="code" id="code" value={accountForm.values.code} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('code'), 'p-inputtext-sm': true })} placeholder="Code" autoFocus required maxLength={10} disabled={!isCreateMode} />
                  {getFormErrorMessage('code')}
              </div>
              <div className="field mb-6 w-1/2">
                <label htmlFor="firmName" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Firm Name</label>
                <InputText type="text" name="firmName" id="firmName" value={accountForm.values.firmName} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('firmName'), 'p-inputtext-sm': true })} placeholder="Firm Name" required maxLength={50} />
                {getFormErrorMessage('firmName')}
              </div>
            </div>
            <div className='flex justify-between gap-4'>
              <div className="field mb-6 w-1/2">
                <label htmlFor="proprietor" className="block mb-2">Proprietor</label>
                <InputText type="text" name="proprietor" id="proprietor" value={accountForm.values.proprietor} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('proprietor'), 'p-inputtext-sm': true })} placeholder="Proprietor" maxLength={50} />
                {getFormErrorMessage('proprietor')}
              </div>
              <div className="field mb-6 w-1/2">
                <label htmlFor="phone" className="block mb-2">Phone</label>
                <InputMask type="text" name="phone" id="phone" mask="9999999999" slotChar="" unmask={true} autoClear={false} value={accountForm.values.phone} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('phone'), 'p-inputtext-sm': true })} placeholder="Phone" />
                {getFormErrorMessage('phone')}
              </div>
            </div>
            <div className='flex justify-between gap-4'>
              <div className="field mb-6 w-1/2">
                <label htmlFor="dno" className="block mb-2">Door No</label>
                <InputText type="text" name="dno" id="dno" value={accountForm.values.dno} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('dno'), 'p-inputtext-sm': true })} placeholder="Door No" maxLength={30} />
                {getFormErrorMessage('dno')}
              </div>
              <div className="field mb-6 w-1/2">
                <label htmlFor="strtNo" className="block mb-2">Street No</label>
                <InputText type="text" name="strtNo" id="strtNo" value={accountForm.values.strtNo} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('strtNo'), 'p-inputtext-sm': true })} placeholder="Street No" maxLength={30} />
                {getFormErrorMessage('strtNo')}
              </div>
            </div>
            <div className='flex justify-between gap-4'>
              <div className="field mb-6 w-1/2">
                <label htmlFor="area" className="block mb-2">Area</label>
                <InputText type="text" name="area" id="area" value={accountForm.values.area} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('area'), 'p-inputtext-sm': true })} placeholder="Area" maxLength={50} />
                {getFormErrorMessage('area')}
              </div>
              <div className="field mb-6 w-1/2">
                <label htmlFor="town" className="block mb-2">Town</label>
                <InputText type="text" name="town" id="town" value={accountForm.values.town} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('town'), 'p-inputtext-sm': true })} placeholder="Town" maxLength={50} />
                {getFormErrorMessage('town')}
              </div>
            </div>
            <div className='flex justify-between gap-4'>
              <div className="field mb-6 w-1/2">
                  <label htmlFor="dl1" className="block mb-2">Drug License 1</label>
                  <InputText type="text" name="dl1" id="dl1" value={accountForm.values.dl1} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('dl1'), 'p-inputtext-sm': true })} placeholder="Drug License 1" maxLength={50} />
                  {getFormErrorMessage('dl1')}
              </div>
              <div className="field mb-6 w-1/2">
                  <label htmlFor="dl2" className="block mb-2">Drug License 2</label>
                  <InputText type="text" name="dl2" id="dl2" value={accountForm.values.dl2} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('dl2'), 'p-inputtext-sm': true })} placeholder="Drug License 2" maxLength={50} />
                  {getFormErrorMessage('dl2')}
              </div>
            </div>
            <div className='flex justify-between gap-4'>
              <div className="field mb-6 w-1/2">
                  <label htmlFor="gst" className="block mb-2">GST</label>
                  <InputText type="text" name="gst" id="gst" value={accountForm.values.gst} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('gst'), 'p-inputtext-sm': true })} placeholder="GST" minLength={2} maxLength={15} />
                  {getFormErrorMessage('gst')}
              </div>
              <div className="field mb-6 w-1/2">
                  <label htmlFor="mailid" className="block mb-2">Mail ID</label>
                  <InputText type="text" name="mailid" id="mailid" value={accountForm.values.mailid} onChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('mailid'), 'p-inputtext-sm': true })} placeholder="Mail ID" maxLength={50} />
                  {getFormErrorMessage('mailid')}
              </div>
            </div>
            <div className='flex justify-between gap-4'>
              <div className="field mb-6 w-1/2">
                  <label htmlFor="opngBalAmt" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Opening Balance</label>
                  <InputNumber id="opngBalAmt" name="opngBalAmt" value={accountForm.values.opngBalAmt as number} onValueChange={accountForm.handleChange} onBlur={accountForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('opngBalAmt'), 'p-inputtext-sm': true })} placeholder="Opening Balance" mode="decimal" maxFractionDigits={2} locale="en-IN" required/>
                  {getFormErrorMessage('opngBalAmt')}
              </div>
              <div className="field mb-6 w-1/2">
                <label htmlFor="groupCode" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Group Code</label>
                <Dropdown inputId='groupCode' id="groupCode" name='groupCode' options={groupList} optionLabel="name" optionValue="code" value={accountForm.values.groupCode} filter showClear filterBy="code,name" filterPlaceholder="Search group code or name" onChange={(e) => { accountForm.setFieldValue("groupCode", e.value) }} onBlur={accountForm.handleBlur} placeholder='Select Group'
                 valueTemplate={selectedGroupTemplate} itemTemplate={optionGroupTemplate} required className={classNames({ 'p-invalid': isFormFieldValid('groupCode'), 'p-inputtext-sm': true })} style={{"width": "100%"}} resetFilterOnHide={true}>
                </Dropdown>
                {getFormErrorMessage('groupCode')}
              </div>
            </div>
          </form>
        </div>
    </Dialog>
  )
}

export default AccountFormComponent