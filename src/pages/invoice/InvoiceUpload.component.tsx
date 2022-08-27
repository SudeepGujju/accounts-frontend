import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getUserDropdownList
} from "../../api";
import { User } from "../../models";

import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";

import { Dropdown } from "primereact/dropdown";

function InvoiceUploadComponent() {
  const [userList, setUserList] = useState<Partial<User>[]>([]);
  const [invoiceUser, setInvoiceUser] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUserList = async () => {
      try {
        const response = await getUserDropdownList();
        setUserList(response.data);
      } catch (e) {
        setUserList([]);
      }
    };

    getUserList();
  }, []);

  const openInvoiceDialog = () => {
    navigate(
      { pathname: "/dialog/upload", search: "?type=invoice&userId="+invoiceUser },
      { state: { backgroundLocation: location } }
    );
  }

  return (
    <>
      <div className="p-3">
        <div className="text-xl text-center my-2 font-semibold">Invoice Upload</div>
        <div className="flex gap-4 justify-center items-center border py-4" style={{ maxHeight: "calc(100vh - 160px)" }}>
          <div>
            <label htmlFor="invoiceUser" className="block mb-2 text-lg font-medium">Select user to upload invoices</label>
          </div>
          <div className="field w-1/3 max-w-1/3">
            <Dropdown inputId='invoiceUser' id="invoiceUser" name='invoiceUser' options={userList} optionLabel="username" optionValue="_id" value={invoiceUser} filter showClear filterBy="username" filterPlaceholder="Search user" onChange={(e) => { setInvoiceUser(e.target.value) }} placeholder='Select User'
            className="p-inputtext-sm" style={{"width": "100%"}} resetFilterOnHide={true}>
            </Dropdown>
          </div>
          <Button
            icon="pi pi-upload"
            label="Upload"
            className="p-button-raised p-button-sm"
            disabled={!invoiceUser}
            onClick={openInvoiceDialog}
          ></Button>
        </div>
      </div>
    </>
  );
}

export default InvoiceUploadComponent;
