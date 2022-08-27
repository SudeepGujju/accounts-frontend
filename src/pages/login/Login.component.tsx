import React, { useState } from "react";
import "./Login.component.css";

import { FormikProps, useFormik } from "formik";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from "primereact/utils";
import * as yup from 'yup';

import { loginUser } from "../../api";
import { setUser, setUserToken } from "../../services";

import StandingPersonIMG from '../../assets/StandingPerson.svg';

type LoginForm = {
  loginID: string,
  password: string
}

function LoginComponent(): any{

  const [errorMessage, seterrorMessage] = useState<string>("");
  
  const loginForm: FormikProps<LoginForm> = useFormik<LoginForm>({
    initialValues: { loginID: "", password: "" },
    validationSchema: yup.object({
      loginID: yup.string().required("Login ID is required"),
      password: yup.string().required("Password is required"),
    }),
    onSubmit: async (data:LoginForm) => {

      seterrorMessage("");

      try{
        const response = await loginUser(data);

        setUser(response.data.user);
        setUserToken(response.data.tokens);
        window.location.reload();

      }catch(e: any){
        seterrorMessage(e);
      }

      return;

    },
  });

  const isFormFieldValid = (name: "loginID"|"password") => !!(loginForm.touched[name] && loginForm.errors[name]);

  const getFormErrorMessage = (name: "loginID"|"password") => {
    return isFormFieldValid(name) && <small className="p-error">{loginForm.errors[name]}</small>;
  };

  return (
    <div className="flex justify-evenly w-screen h-screen items-center">
      <div className="w-2/6 h-full relative">
        <img src={StandingPersonIMG} className="absolute h-2/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"/>
      </div>
      <div className="border h-3/4"></div>
      <div className="border rounded-md w-2/6 pl-4 pr-4">
        <h2 className="text-center p-6 text-2xl font-normal">Login</h2>
        <hr />
        <form onSubmit={loginForm.handleSubmit} className="p-fluid pt-6 pb-6">
            {
              errorMessage && (
                <div className="mb-6 text-center p-error">
                  {errorMessage}
                </div>
              )
            }
            <div className="mb-6">
              <div className="p-input-icon-left">
                <i className="pi pi-user" />
                <InputText type="text" name="loginID" id="loginID" value={loginForm.values.loginID} onChange={loginForm.handleChange} onBlur={loginForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('loginID') })} placeholder="Login ID" autoFocus disabled={loginForm.isSubmitting} />
              </div>
              {getFormErrorMessage('loginID')}
            </div>
            <div className="mb-6">
              <div className="p-input-icon-left">
                <i className="pi pi-key" />
                <InputText type="password" name="password" id="password" value={loginForm.values.password} onChange={loginForm.handleChange} onBlur={loginForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('password') })} placeholder="Password" disabled={loginForm.isSubmitting}/>
              </div>
              {getFormErrorMessage('password')}
            </div>
            <div>
              <Button type="submit" label="Login" disabled={loginForm.isSubmitting} iconPos="right" loading={loginForm.isSubmitting}/>
            </div>
          </form>
      </div>
    </div>
  );
}

export default LoginComponent;
