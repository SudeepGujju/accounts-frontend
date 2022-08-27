import React, { useContext } from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import { UserContext } from "../../context";
import { UserType } from "../../models";
import InvoiceUploadComponent from "./InvoiceUpload.component";
import InvoiceListComponent from "./InvoiceList.component";

function InvoiceComponent({ location }: any) {
  const userCtx = useContext(UserContext);

  return (
    <Routes location={location}>
      <Route path="/" element={<Outlet></Outlet>}>
        {userCtx?.user?.userType === UserType.Admin ? (
          <Route
            index
            element={<InvoiceUploadComponent></InvoiceUploadComponent>}
          ></Route>
        ) : (
          <Route
            index
            element={<InvoiceListComponent></InvoiceListComponent>}
          ></Route>
        )}
      </Route>
    </Routes>
  );
}

export default InvoiceComponent;
