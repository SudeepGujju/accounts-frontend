import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  deleteTransaction,
  getAccountDropdownList,
  getTransactionList,
} from "../../api";
import { Account, Transaction } from "../../models";

import { FormikProps, useFormik } from "formik";
import * as yup from "yup";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { useLocation, useNavigate } from "react-router-dom";
import { ALERT_TYPE, showAlert } from "../../services";
import { eventBus, formatAmount, formatDate } from "../../utils";
import { TRANSACTION_LIST_REFRESH_EVENT } from "../../constants";
import { UserContext } from "../../context";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

type TransactionSearch = {
  fromAcc: string|undefined;
  toAcc: string|undefined;
  fromDate: Date;
  toDate: Date;
}

function TransactionListComponent() {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [accountList, setAccountList] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const tableRef = useRef<any>(null);
  const userCtx = useContext(UserContext);

  const transactionMinDate = userCtx?.user?.finYearStart ? new Date(userCtx?.user?.finYearStart): undefined;
  const transactionMaxDate = userCtx?.user?.finYearEnd ? new Date(userCtx?.user?.finYearEnd): undefined;
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const transactionForm: FormikProps<TransactionSearch> = useFormik<TransactionSearch>({
    initialValues: {
      fromDate: currentDate,
      toDate: currentDate,
      fromAcc: undefined,
      toAcc: undefined,
    },
    validationSchema: yup.object({
      fromDate: yup.date().nullable(),
      toDate: yup.date().nullable(),
      fromAcc: yup.string(),
      toAcc: yup.string()
    }),
    onSubmit: async (data: TransactionSearch) => {
      try {
        await getList();
      } catch (e: any) {}
    },
  });

  const getList = useCallback(async () => {

    if(!transactionForm.isValid){
      return;
    }

    setLoading(true);

    try {

      const search: any = Object.assign({}, transactionForm.values);

      search.toDate = search.toDate ? search.toDate.toISOString() : undefined;
      search.fromDate = search.fromDate ? search.fromDate.toISOString() : undefined;

      const response = await getTransactionList(search);

      setTransactionList(response.data);

      setLoading(false);
    } catch (e) {
      setTransactionList([]);
      setLoading(false);

      const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
      showAlert(alertConfig);
    }
  }, [transactionForm.values, transactionForm.isValid]);

  useEffect(() => {
    const getAccountList = async () => {
      try {
        const response = await getAccountDropdownList();
        setAccountList(response.data);
      } catch (e) {
        setAccountList([]);
      }
    };

    getAccountList();
  }, []);

  useEffect(() => {

    const refresh = () => {
      getList();
    };

    eventBus.on(TRANSACTION_LIST_REFRESH_EVENT, refresh);

    return () => {
      eventBus.remove(TRANSACTION_LIST_REFRESH_EVENT, refresh);
    };
  }, [getList]);

  const editRecord = async (transaction: Transaction) => {
    navigate("/dialog/transaction/edit/" + transaction._id, {
      state: { backgroundLocation: location },
    });
  };

  const deleteRecord = async (transaction: Transaction) => {
    try {
      const response = await deleteTransaction(transaction._id);

      const alertConfig = {
        title: "Success",
        message: response.data,
        type: ALERT_TYPE.SUCCESS,
        onClose: () => {
          getList();
        },
      };
      showAlert(alertConfig);
    } catch (e) {
      const alertConfig = {
        title: "Error",
        message: e as string,
        type: ALERT_TYPE.ERROR,
      };
      showAlert(alertConfig);
    }
  };

  const deleteConfirmation = (rowData: Transaction) => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptClassName: "p-button-danger",
      accept: () => {
        deleteRecord(rowData);
      },
    });
  };

  const actionBodyTemplate = (rowData: Transaction) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-text p-button-raised"
          onClick={() => {
            editRecord(rowData);
          }}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-text p-button-raised p-button-danger"
          onClick={() => {
            deleteConfirmation(rowData);
          }}
        />
      </>
    );
  };

  const header = () => {
    return (
      <div className="flex items-center justify-between">
        <div>
          <Button
            icon="pi pi-plus"
            label="New"
            className="p-button-raised p-button-sm"
            onClick={() => {
              navigate("/dialog/transaction/create", {
                state: { backgroundLocation: location },
              });
            }}
          ></Button>
        </div>
        <div className="text-xl">Transactions</div>
        <div>
          <Button
            type='button'
            icon="pi pi-refresh"
            label="Refresh List"
            className="p-button-raised p-button-sm !mr-2"
            onClick={() => {
              getList();
            }}
            loading={loading}
          ></Button>
          <Button
            type='button'
            icon="pi pi-download"
            label="Download"
            className="p-button-raised p-button-sm !mr-2"
            onClick={() => {
              exportCSV();
            }}
          ></Button>
          <Button
            type='button'
            icon="pi pi-upload"
            label="Upload"
            className="p-button-raised p-button-sm"
            onClick={() => {
              navigate(
                { pathname: "/dialog/upload", search: "?type=transaction" },
                { state: { backgroundLocation: location } }
              );
            }}
          ></Button>
        </div>
      </div>
    );
  };

  const isFormFieldValid = (name: keyof TransactionSearch) => !!(transactionForm.touched[name] && transactionForm.errors[name]);

  const getFormErrorMessage = (name: keyof TransactionSearch) => {
    return isFormFieldValid(name) && <small className="p-error">{transactionForm.errors[name]}</small>;
  };

  const exportCSV = () => {
    tableRef?.current?.exportCSV({ selectionOnly: false });
  };

  const formatTransactionAmount = (rowData: Transaction, field: 'received'|'paid') => {
    return formatAmount(rowData[field]);
  }

  const formatTransactionDate = (rowData: Transaction,) => {
    return formatDate(new Date(rowData.trnxDate));
  }

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

  return (
    <>
      <div className="p-3">
        <form className="p-fluid">
          <fieldset className="border-2 rounded-md pb-2">
            <legend className="ml-4 text-lg">Transaction Search</legend>
            <div className="flex gap-4 justify-center">
                <div className="field">
                    <label htmlFor="fromDate" className="block mb-2">From Date</label>
                    <Calendar name="fromDate" id="fromDate" value={transactionForm.values.fromDate} onChange={ (e) => { transactionForm.setFieldValue('fromDate', e.target.value) } } onBlur={transactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('fromDate'), 'p-inputtext-sm': true })} placeholder="From Date"
                      dateFormat="dd/mm/yy" minDate={transactionMinDate} maxDate={transactionForm.values.toDate} monthNavigator yearNavigator yearRange={`${ transactionMinDate?.getFullYear() }:${transactionMaxDate?.getFullYear()}`} mask="99/99/9999"
                      showOnFocus={false}
                    />
                    {getFormErrorMessage('fromDate')}
                </div>
                <div className="field">
                    <label htmlFor="toDate" className="block mb-2">To Date</label>
                    <Calendar name="toDate" id="toDate" value={transactionForm.values.toDate} onChange={ (e) => { transactionForm.setFieldValue('toDate', e.target.value) } } onBlur={transactionForm.handleBlur} className={classNames({ 'p-invalid': isFormFieldValid('toDate'), 'p-inputtext-sm': true })} placeholder="To Date"
                      dateFormat="dd/mm/yy" minDate={transactionForm.values.fromDate} maxDate={transactionMaxDate} monthNavigator yearNavigator yearRange={`${ transactionMinDate?.getFullYear() }:${transactionMaxDate?.getFullYear()}`} mask="99/99/9999"
                      showOnFocus={false}
                    />
                    {getFormErrorMessage('toDate')}
                </div>
                <div className="field w-1/4 max-w-1/4">
                  <label htmlFor="fromAcc" className="block mb-2">From Account</label>
                  <Dropdown inputId='fromAcc' id="fromAcc" name='fromAcc' options={accountList} optionLabel="firmName" optionValue="code" value={transactionForm.values.fromAcc} filter showClear filterBy="code,firmName" filterPlaceholder="Search group code or name" onChange={(e) => { transactionForm.setFieldValue("fromAcc", e.value) }} onBlur={transactionForm.handleBlur} placeholder='Select Account'
                  valueTemplate={selectedAccountTemplate} itemTemplate={optionAccountTemplate} className={classNames({ 'p-invalid': isFormFieldValid('fromAcc'), 'p-inputtext-sm': true })} style={{"width": "100%"}} resetFilterOnHide={true}>
                  </Dropdown>
                  {getFormErrorMessage('fromAcc')}
                </div>
                <div className="field w-1/4 max-w-1/4">
                  <label htmlFor="toAcc" className="block mb-2">To Account</label>
                  <Dropdown inputId='toAcc' id="toAcc" name='toAcc' options={accountList} optionLabel="firmName" optionValue="code" value={transactionForm.values.toAcc} filter showClear filterBy="code,firmName" filterPlaceholder="Search group code or name" onChange={(e) => { transactionForm.setFieldValue("toAcc", e.value) }} onBlur={transactionForm.handleBlur} placeholder='Select Account'
                  valueTemplate={selectedAccountTemplate} itemTemplate={optionAccountTemplate} className={classNames({ 'p-invalid': isFormFieldValid('toAcc'), 'p-inputtext-sm': true })} style={{"width": "100%"}} resetFilterOnHide={true}>
                  </Dropdown>
                  {getFormErrorMessage('toAcc')}
                </div>
                <div className="field">
                  <label className="block invisible">.</label>
                  { <Button type='button' label="Search" onClick={transactionForm.submitForm} disabled={!transactionForm.isValid} icon="pi pi-search" className="w-1/2" /> }
                </div>
            </div>
          </fieldset>
        </form>
      </div>
      <div className="mx-3" style={{ maxHeight: "calc(100vh - 160px)" }}>
        <DataTable
          ref={tableRef}
          loading={loading}
          value={transactionList}
          size="small"
          showGridlines
          // scrollable
          responsiveLayout="scroll"
          scrollHeight="55vh"
          stripedRows
          removableSort
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          rows={10}
          rowsPerPageOptions={[10, 20]}
          header={header}
          emptyMessage="No Data Available"
          exportFilename="transactions"
        >
          <Column field="trnxDate" header="Trnx. Date" sortable body={formatTransactionDate}></Column>
          <Column field="fromAcc" header="From Acc" sortable></Column>
          <Column field="toAcc" header="To Acc" sortable></Column>
          <Column field="desc" header="Description" sortable></Column>
          <Column field="rno" header="Receipt" sortable></Column>
          <Column
            field="received"
            header="Received"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatTransactionAmount(rowData, "received") }}
          ></Column>
          <Column
            field="paid"
            header="Paid"
            align="right"
            alignHeader="left"
            sortable
            body={(rowData) => { return formatTransactionAmount(rowData, "paid") }}
          ></Column>
          <Column header="Operations" body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
    </>
  );
}

export default TransactionListComponent;
