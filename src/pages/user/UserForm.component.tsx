import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UserForm.component.css";

import { FormikHelpers, FormikProps, useFormik } from "formik";
import * as yup from "yup";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import { InputMask } from "primereact/inputmask";


import { createUser, getUser, updateUser } from "../../api";
import { User, UserStatus, getUserStatus } from "../../models";
import { ALERT_TYPE, showAlert } from "../../services";
import { eventBus } from "../../utils";
import { USER_LIST_REFRESH_EVENT } from "../../constants";
import { AppContext } from "../../context";

type UserForm = User & {
  password: string,
  cpassword: string,
}

const finYearsList = [
  {label: '2022-2023', value: "2022-2023"},
];

function UserFormComponent() {

  const params = useParams();
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(true);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
  const appCtx = useContext(AppContext);

  const userForm: FormikProps<UserForm> = useFormik<UserForm>({
    initialValues: {
      _id: "",
      username: "",
      loginID: "",
      finYear: "",
      phone: "",
      status: UserStatus.Active,
      password: "",
      cpassword: ""
    },
    validationSchema: yup.object({
      username: yup.string().min(3, 'Username must be 3 characters or more').max(30,'Username must be 30 characters or less').required('Username is required'),
      loginID: yup.string().min(3, 'Login ID must be 3 characters or more').max(15, 'Login ID must be 15 characters or less').required('Login ID is required'),
      finYear: yup.string().required('Financial year is required'),
      phone: yup.string().min(10, 'Phone number must be 10 characters').max(10, 'Phone number must be 10 characters'),
      status: yup.mixed().oneOf([UserStatus.Active, UserStatus.Inactive]).required('Status is required'),
      password: yup.string().min(7, 'Password must be 7 characters or more').max(15, 'Password must be 15 characters or less').required('Password is required'),
      cpassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm Password is required'),
    }),
    onSubmit: async (data: UserForm, {setErrors}: FormikHelpers<UserForm>) => {

      appCtx?.setDisplayLoader(true);

      const user: any = Object.assign({}, data);

      try{

        let response;

        if(isCreateMode){

          delete user._id;

          response = await createUser(user);

        }else{

          const id = user._id;

          delete user._id;

          response = await updateUser(user, id);
        }

        appCtx?.setDisplayLoader(false);

        const alertConfig = {title: 'Success', message: response.data, type: ALERT_TYPE.SUCCESS, onClose: () => {
          closeDialog(true);
        }};
        showAlert(alertConfig);

      }catch(e: any){

        appCtx?.setDisplayLoader(false);

        if(typeof e == 'string' && e.includes("login ID already exists")){
          setErrors({'loginID': 'Login ID is already registered'});
          return;
        }else{
          const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
          showAlert(alertConfig);
        }

      }

    }
  });

  useEffect(() => {

    if(!params.id)
    {
      setIsCreateMode(true);
      return;
    }

    setIsCreateMode(false);

    const getUserInfo = async () => {
      try {
        const response = await getUser(params.id as string);

        userForm.setValues( {...response.data as UserForm, password: '', cpassword: ''} )
  
      } catch (e) {
        const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
        showAlert(alertConfig);
      }
    }

    getUserInfo();

  }, [params.id]);

  const closeDialog = (refresh?: boolean) => {

    refresh && eventBus.dispatch(USER_LIST_REFRESH_EVENT);

    setVisible(false);
    navigate(-1);
  }

  const footer = (
      <div>
          <Button label="Close" icon="pi pi-times" onClick={() => closeDialog()} />
          <Button type="button" label="Save" icon="pi pi-save" onClick={userForm.submitForm} disabled={!userForm.isValid} />
      </div>
  );

  const isFormFieldValid = (name: keyof UserForm) => !!(userForm.touched[name] && userForm.errors[name]);

  const getFormErrorMessage = (name: keyof UserForm) => {
    return isFormFieldValid(name) && <small className="p-error">{userForm.errors[name]}</small>;
  };

  return <Dialog visible={visible} modal closeOnEscape={false} header={`User - ${isCreateMode ? 'Create' : 'Edit' }`} footer={footer} onHide={ closeDialog } style={{'width': '30%'}} blockScroll={true}>
        <div className="p-2">
          <form className="p-fluid">
            <div className="field mb-4">
                <label htmlFor="username" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Username</label>
                <InputText type="text" name="username" id="username" value={userForm.values.username} onChange={userForm.handleChange} onBlur={userForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('username'), 'p-inputtext-sm': true })} placeholder="Username" autoFocus required minLength={3} maxLength={30} disabled={!isCreateMode} />
                {getFormErrorMessage('username')}
            </div>
            <div className="field mb-4">
                <label htmlFor="loginID" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Login ID</label>
                <InputText type="text" name="loginID" id="loginID" value={userForm.values.loginID} onChange={userForm.handleChange} onBlur={userForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('loginID'), 'p-inputtext-sm': true })} placeholder="Login ID" required maxLength={15} disabled={!isCreateMode} />
                {getFormErrorMessage('loginID')}
            </div>
            <div className="field mb-4">
                <label htmlFor="password" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Password</label>
                <InputText type="password" name="password" id="password" value={userForm.values.password} onChange={userForm.handleChange} onBlur={userForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('password'), 'p-inputtext-sm': true })} placeholder="Password" required minLength={7} maxLength={15} />
                {getFormErrorMessage('password')}
            </div>
            <div className="field mb-4">
                <label htmlFor="cpassword" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Confirm Password</label>
                <InputText type="password" name="cpassword" id="cpassword" value={userForm.values.cpassword} onChange={userForm.handleChange} onBlur={userForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('cpassword'), 'p-inputtext-sm': true })} placeholder="Confirm Password" required minLength={7} maxLength={15} />
                {getFormErrorMessage('cpassword')}
            </div>
            <div className="field mb-4">
                <label htmlFor="phone" className="block mb-2">Phone</label>
                <InputMask type="text" name="phone" id="phone" mask="9999999999" slotChar="" unmask={true} autoClear={false} value={userForm.values.phone} onChange={userForm.handleChange} onBlur={userForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('phone'), 'p-inputtext-sm': true })} placeholder="Phone" />
                {getFormErrorMessage('phone')}
            </div>
            <div className="field mb-4">
              <label htmlFor="finYear" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Financial Year</label>
              <Dropdown inputId="finYear" name='finYear' id='finYear' options={finYearsList} optionLabel="label" optionValue="value" value={userForm.values.finYear} onChange={userForm.handleChange} onBlur={userForm.handleBlur} placeholder='Select Financial Year' className={classNames({ 'p-invalid': isFormFieldValid('finYear') })} required disabled={!isCreateMode}>
              </Dropdown>
              {getFormErrorMessage('finYear')}
            </div>
            <div className="field">
              <label htmlFor="status" className="block mb-2">Status</label>
              <div className="flex align-middle gap-4">
                <InputSwitch inputId='status' name='status' id='status' checked={userForm.values.status} trueValue={UserStatus.Active} falseValue={UserStatus.Inactive} onChange={(e) => userForm.setFieldValue('status', e.value)} onBlur={userForm.handleBlur}/>
                {getUserStatus(userForm.values.status)?.toUpperCase()}
              </div>
            </div>
          </form>
        </div>
  </Dialog>;
}

export default UserFormComponent;
