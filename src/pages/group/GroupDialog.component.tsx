import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import GroupFormComponent from "./GroupForm.component";

function GroupDialogComponent() {
  return (
    <Routes>
      <Route path="/" element={<Outlet></Outlet>}>
        <Route
          path="create"
          element={<GroupFormComponent></GroupFormComponent>}
        ></Route>
        <Route
          path="edit/:id"
          element={<GroupFormComponent></GroupFormComponent>}
        ></Route>
      </Route>
    </Routes>
  );
}

export default GroupDialogComponent;