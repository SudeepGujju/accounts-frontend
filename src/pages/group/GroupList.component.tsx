import React, { useCallback, useEffect, useRef, useState } from "react";
import { deleteGroup, getGroupList } from "../../api";
import { getGroupName, Group } from "../../models";
import "./GroupList.component.css";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { useLocation, useNavigate } from "react-router-dom";
import { ALERT_TYPE, showAlert } from "../../services";
import { eventBus } from "../../utils";
import { GROUP_LIST_REFRESH_EVENT } from "../../constants";

function GroupListComponent() {
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const tableRef = useRef<any>(null);

  const getList = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getGroupList();

      setGroupList(
        response.data.map((x) => {
          x.groupName = getGroupName(x.grpType);
          return x;
        })
      );

      setLoading(false);
    } catch (e) {
      setGroupList([]);
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

    eventBus.on(GROUP_LIST_REFRESH_EVENT, refresh);

    return () => {
      eventBus.remove(GROUP_LIST_REFRESH_EVENT, refresh);
    };
  }, [getList]);

  const editRecord = async (group: Group) => {
    navigate("/dialog/group/edit/" + group._id, {
      state: { backgroundLocation: location },
    });
  };

  const deleteRecord = async (group: Group) => {
    try {
      const response = await deleteGroup(group._id);

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

  const actionBodyTemplate = (rowData: any) => {
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
              navigate("/dialog/group/create", {
                state: { backgroundLocation: location },
              });
            }}
          ></Button>
        </div>
        <div className="text-xl">Groups</div>
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
                { pathname: "/dialog/upload", search: "?type=group" },
                { state: { backgroundLocation: location } }
              );
            }}
          ></Button>
        </div>
      </div>
    );
  };

  const exportCSV = () => {
    tableRef?.current?.exportCSV({ selectionOnly: false });
  }

  return (
    <>
      <div className="mx-3">
        <DataTable
          ref={tableRef}
          loading={loading}
          value={groupList}
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
          exportFilename="groups"
        >
          <Column field="code" header="Code" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="groupName" header="Type" sortable></Column>
          <Column header="Operations" body={actionBodyTemplate}></Column>
        </DataTable>
      </div>
    </>
  );
}

export default GroupListComponent;
