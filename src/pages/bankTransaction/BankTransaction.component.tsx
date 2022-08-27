import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import BankTransactionListComponent from "./BankTransactionList.component";

function BankTransactionComponent({location}: any) {

  return (
    <Routes location={location} >
      <Route path="/" element={<Outlet></Outlet>}>
        <Route
          index
          element={<BankTransactionListComponent></BankTransactionListComponent>}
        ></Route>
      </Route>
    </Routes>
  );
}

export default BankTransactionComponent;