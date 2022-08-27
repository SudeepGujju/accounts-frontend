import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import BankTransactionForm from "./BankTransactionForm.component";

function BankTransactionDialogComponent() {
  return (
    <Routes>
      <Route path="/" element={<Outlet></Outlet>}>
        <Route
          path="create"
          element={<BankTransactionForm></BankTransactionForm>}
        ></Route>
        <Route
          path="edit/:id"
          element={<BankTransactionForm></BankTransactionForm>}
        ></Route>
      </Route>
    </Routes>
  );
}

export default BankTransactionDialogComponent;