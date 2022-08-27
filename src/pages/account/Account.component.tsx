import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import AccountListComponent from "./AccountList.component";

function AccountComponent({location}: any) {
  return (
    <Routes location={location} >
      <Route path="/" element={<Outlet></Outlet>}>
        <Route index element={<AccountListComponent></AccountListComponent>}></Route>
      </Route>
    </Routes>
  );
}

export default AccountComponent;
