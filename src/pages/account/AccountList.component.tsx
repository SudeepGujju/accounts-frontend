import React, { useCallback, useEffect, useRef, useState } from "react";
import { deleteAccount, getAccountList } from "../../api";
import { Account } from "../../models";
import "./AccountList.component.css";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { useLocation, useNavigate } from "react-router-dom";
import { ALERT_TYPE, showAlert } from "../../services";
import { ACCOUNT_LIST_REFRESH_EVENT } from "../../constants";
import { eventBus, formatAmount } from "../../utils";

function AccountListComponent() {
  const [accountList, setAccountList] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const tableRef = useRef<any>(null);

  const getList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getAccountList();

      setAccountList(response.data);
      setLoading(false);
    } catch (e) {
      setAccountList([]);
      setLoading(false);

      const alertConfig = {title: 'Error', message: e as string, type: ALERT_TYPE.ERROR};
      showAlert(alertConfig);
    }
  }, []);

  useEffect(() => {
    getList();

    const refresh = () => {
      getList();
    };

    eventBus.on(ACCOUNT_LIST_REFRESH_EVENT, refresh);

    return () => {
      eventBus.remove(ACCOUNT_LIST_REFRESH_EVENT, refresh);
    };
  }, [getList]);

  const editRecord = async (account: Account) => {
    navigate("/dialog/account/edit/" + account._id, {
      state: { backgroundLocation: location },
    });
  };

  const deleteRecord = async (account: Account) => {
    try {
      const response = await deleteAccount(account._id);

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

  const deleteConfirmation = (rowData: any) => {
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

  const actionBodyTemplate = (rowData: Account) => {
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

  const exportCSV = () => {
    tableRef?.current?.exportCSV({ selectionOnly: false });
  }

  const formatOpeningBalance = (rowData: Account) => {
    return formatAmount(rowData.opngBalAmt)
  }

  const header = () => {
    return (
      <div className="flex items-center justify-between">
        <div>
          <Button
            icon="pi pi-plus"
            label="New"
            className="p-button-raised p-button-sm"
            onClick={() => {
              navigate("/dialog/account/create", {
                state: { backgroundLocation: location },
              });
            }}
          ></Button>
        </div>
        <div className="text-xl">Accounts</div>
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
            onClick={() => {exportCSV()}}
          ></Button>
          <Button
            type='button'
            icon="pi pi-upload"
            label="Upload"
            className="p-button-raised p-button-sm"
            onClick={() => {
              navigate(
                { pathname: "/dialog/upload", search: "?type=account" },
                { state: { backgroundLocation: location } }
              );
            }}
          ></Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mx-3">
        <DataTable
          ref={tableRef}
          loading={loading}
          value={accountList}
          size="small"
          showGridlines
          // scrollable
          responsiveLayout="scroll"
          scrollHeight="70vh"
          stripedRows
          removableSort
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
          rows={10}
          rowsPerPageOptions={[10, 20]}
          header={header}
          emptyMessage="No Data Available"
          exportFilename="accounts"
        >
          <Column field="code" header="Code" sortable></Column>
          <Column field="firmName" header="Firm Name" sortable></Column>
          <Column field="town" header="Town" sortable></Column>
          <Column field="proprietor" header="Proprietor" sortable></Column>
          <Column field="phone" header="Phone" sortable></Column>
          <Column field="gst" header="GST" sortable></Column>
          <Column
            field="opngBalAmt"
            header="Opening Balance"
            sortable
            align="right"
            alignHeader="left"
            body={formatOpeningBalance}
          ></Column>
          <Column field="groupCode" header="Group Code" sortable></Column>
          <Column header="Operations" body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
    </>
  );
}

export default AccountListComponent;
