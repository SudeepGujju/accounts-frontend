import React, { useContext } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { UserContext } from "../../context";
import { UserType } from "../../models";
import CustomerSalesList from "./CustomerSalesList.component";

function CustomerSalesComponent({ location }: any) {
  const userCtx = useContext(UserContext);

  return (
    <Routes location={location}>
      <Route path="/" element={<Outlet></Outlet>}>
        {userCtx?.user?.userType === UserType.Admin ? (
          <Route
            index
            element={<CustomerSalesList></CustomerSalesList>}
          ></Route>
        ) : (
          <Navigate to={'/'} ></Navigate>
        )}
      </Route>
    </Routes>
  );
}

export default CustomerSalesComponent;
