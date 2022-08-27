import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import AccountFormComponent from "./AccountForm.component";

function AccountDialogComponent() {
  return (
    <Routes>
      <Route path="/" element={<Outlet></Outlet>}>
        <Route
          path="create"
          element={<AccountFormComponent></AccountFormComponent>}
        ></Route>
        <Route
          path="edit/:id"
          element={<AccountFormComponent></AccountFormComponent>}
        ></Route>
      </Route>
    </Routes>
  );
}

export default AccountDialogComponent;