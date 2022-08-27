import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './GroupForm.component.css';

import { FormikHelpers, FormikProps, useFormik } from "formik";
import * as yup from 'yup';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { createGroup, getGroup, updateGroup} from '../../api';
import { GroupType, GROUP_TYPE_NAME_BALANCE_SHEET, GROUP_TYPE_NAME_TRADING, GROUP_TYPE_NAME_PROFIT_AND_LOSS, Group } from '../../models';
import { ALERT_TYPE, showAlert } from '../../services';
import { eventBus } from '../../utils';
import { GROUP_LIST_REFRESH_EVENT } from '../../constants';
import { AppContext } from '../../context';


const groupTypes = [
  {label: GROUP_TYPE_NAME_BALANCE_SHEET, value: GroupType.BalanceSheet},
  {label: GROUP_TYPE_NAME_PROFIT_AND_LOSS, value: GroupType.ProfitAndLoss},
  {label: GROUP_TYPE_NAME_TRADING, value: GroupType.Trading},
]

function GroupFormComponent() {

  const params = useParams();
  const navigate = useNavigate();
  const [visible, setVisible] = useState<boolean>(true);
  const [isCreateMode, setIsCreateMode] = useState<boolean>(true);
  const appCtx = useContext(AppContext);

  const groupForm: FormikProps<Group> = useFormik<Group>({
    initialValues: {
      _id: "",
      code: "",
      name: "",
      grpType: GroupType.BalanceSheet
    },
    validationSchema: yup.object({
      code: yup.string().max(10,'Code must be 10 characters or less').required('Code is required'),
      name: yup.string().max(50, 'Name must be 50 characters or less').required('Name is required'),
      grpType: yup.mixed().oneOf( [GroupType.BalanceSheet, GroupType.ProfitAndLoss, GroupType.Trading] ).required('Group Type is required')
    }),
    onSubmit: async (data: Group, {setErrors}: FormikHelpers<Group>) => {

      appCtx?.setDisplayLoader(true);

      const group: any = Object.assign({}, data);

      try{

        let response;

        if(isCreateMode){

          delete group._id;

          response = await createGroup(group);

        }else{

          const id = group._id;

          delete group._id;

          response = await updateGroup(group, id);
        }

        appCtx?.setDisplayLoader(false);

        const alertConfig = {title: 'Success', message: response.data, type: ALERT_TYPE.SUCCESS, onClose: () => {
          closeDialog(true);
        }};
        showAlert(alertConfig);

      }catch(e: any){

        appCtx?.setDisplayLoader(false);

        if(typeof e == 'string' && e.includes("already exists")){
          setErrors({'code': 'Code already exists'});
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

    const getGroupInfo = async () => {
      try {
        const response = await getGroup(params.id as string);

        groupForm.setValues( response.data )
  
      } catch (e) {
        const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
        showAlert(alertConfig);
      }
    }

    getGroupInfo();

  }, [params.id]);

  const closeDialog = (refresh?: boolean) => {

    refresh && eventBus.dispatch(GROUP_LIST_REFRESH_EVENT);

    setVisible(false);
    navigate(-1);
  }

  const footer = (
      <div>
          <Button label="Close" icon="pi pi-times" onClick={() => closeDialog()} />
          <Button type="button" label="Save" icon="pi pi-save" onClick={groupForm.submitForm} disabled={!groupForm.isValid} />
      </div>
  );

  const isFormFieldValid = (name: keyof Group) => !!(groupForm.touched[name] && groupForm.errors[name]);

  const getFormErrorMessage = (name: keyof Group) => {
    return isFormFieldValid(name) && <small className="p-error">{groupForm.errors[name]}</small>;
  };

  return (
    <Dialog visible={visible} modal closeOnEscape={false} header={`Group - ${isCreateMode ? 'Create' : 'Edit' }`} footer={footer} onHide={ closeDialog } style={{'width': '50%'}} blockScroll={true}>
        <div className="p-2">
          <form className="p-fluid">
            <div className="field mb-6">
                <label htmlFor="code" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Code</label>
                <InputText type="text" name="code" id="code" value={groupForm.values.code} onChange={groupForm.handleChange} onBlur={groupForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('code'), 'p-inputtext-sm': true })} placeholder="Code" autoFocus required maxLength={10} disabled={!isCreateMode} />
                {getFormErrorMessage('code')}
            </div>
            <div className="field mb-6">
              <label htmlFor="name" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Name</label>
              <InputText type="text" name="name" id="name" value={groupForm.values.name} onChange={groupForm.handleChange} onBlur={groupForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('name'), 'p-inputtext-sm': true })} placeholder="Name" required maxLength={50} />
              {getFormErrorMessage('name')}
            </div>
            <div className="field mb-6">
              <label htmlFor="grpType" className="block mb-2"><span className='text-[#e24c4c]'>*</span>Type</label>
              <Dropdown inputId="grpType" name='grpType' id='grpType' options={groupTypes} optionLabel="label" optionValue="value" value={groupForm.values.grpType} onChange={groupForm.handleChange} onBlur={groupForm.handleBlur} placeholder='Select Group Type' className={classNames({ 'p-invalid': isFormFieldValid('grpType') })}>
              </Dropdown>
              {getFormErrorMessage('grpType')}
            </div>
          </form>
        </div>
    </Dialog>
  )
}

export default GroupFormComponent