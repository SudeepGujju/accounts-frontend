import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./UserList.component.tsx";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";

import { deleteUser, getUserList } from "../../api";
import { getUserStatus, User } from "../../models";
import { ALERT_TYPE, showAlert } from "../../services";
import { eventBus } from "../../utils";
import { USER_LIST_REFRESH_EVENT } from "../../constants";

function UserListComponent() {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getUserList();

      setUserList(
        response.data.map((x) => {
          x.statusText = getUserStatus(x.status);
          return x;
        })
      );

      setLoading(false);
    } catch (e) {
      setUserList([]);
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

    eventBus.on(USER_LIST_REFRESH_EVENT, refresh);

    return () => {
      eventBus.remove(USER_LIST_REFRESH_EVENT, refresh);
    };
  }, [getList]);

  const editRecord = async (user: User) => {
    navigate("/dialog/user/edit/" + user._id, {
      state: { backgroundLocation: location },
    });
  };

  const deleteRecord = async (user: User) => {
    try {
      const response = await deleteUser(user._id);

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

  const deleteConfirmation = (rowData: User) => {
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

  const actionBodyTemplate = (rowData: User) => {
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
              navigate("/dialog/user/create", {
                state: { backgroundLocation: location },
              });
            }}
          ></Button>
        </div>
        <div className="text-xl">Users</div>
        <div>
          <Button
            icon="pi pi-refresh"
            label="Refresh List"
            className="p-button-raised p-button-sm"
            onClick={() => {
              getList();
            }}
            loading={loading}
          ></Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mx-3">
        <DataTable
          loading={loading}
          value={userList}
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
        >
          <Column field="username" header="Username" sortable></Column>
          <Column field="loginID" header="Login ID" sortable></Column>
          <Column field="phone" header="Phone" sortable></Column>
          <Column field="finYear" header="Fin Year" sortable></Column>
          <Column field="statusText" header="Status" sortable></Column>
          <Column header="Operations" body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
    </>
  );
}

export default UserListComponent;
