import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import TransactionListComponent from "./TransactionList.component";

function TransactionComponent({location}: any) {

  return (
    <Routes location={location} >
      <Route path="/" element={<Outlet></Outlet>}>
        <Route
          index
          element={<TransactionListComponent></TransactionListComponent>}
        ></Route>
      </Route>
    </Routes>
  );
}

export default TransactionComponent;