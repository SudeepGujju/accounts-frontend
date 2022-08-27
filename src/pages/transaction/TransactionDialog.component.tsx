import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import TransactionForm from "./TransactionForm.component";

function TransactionDialogComponent() {
  return (
    <Routes>
      <Route path="/" element={<Outlet></Outlet>}>
        <Route
          path="create"
          element={<TransactionForm></TransactionForm>}
        ></Route>
        <Route
          path="edit/:id"
          element={<TransactionForm></TransactionForm>}
        ></Route>
      </Route>
    </Routes>
  );
}

export default TransactionDialogComponent;