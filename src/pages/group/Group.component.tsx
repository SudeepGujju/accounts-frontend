import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import GroupListComponent from "./GroupList.component";

function GroupComponent({location}: any) {

  return (
    <Routes location={location} >
      <Route path="/" element={<Outlet></Outlet>}>
        <Route
          index
          element={<GroupListComponent></GroupListComponent>}
        ></Route>
      </Route>
    </Routes>
  );
}

export default GroupComponent;
