import React from 'react';
import { Outlet, Route, Routes } from "react-router-dom";
import UserFormComponent from './UserForm.component';

function UserDialogComponent() {
  return (
    <Routes>
      <Route path="/" element={<Outlet></Outlet>}>
        <Route
          path="create"
          element={<UserFormComponent></UserFormComponent>}
        ></Route>
        <Route
          path="edit/:id"
          element={<UserFormComponent></UserFormComponent>}
        ></Route>
      </Route>
    </Routes>
  )
}

export default UserDialogComponent;