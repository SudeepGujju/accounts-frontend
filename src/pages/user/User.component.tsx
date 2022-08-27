import React from 'react';
import { Outlet, Route, Routes } from "react-router-dom";
import UserListComponent from './UserList.component';

function UserComponent({location}: any) {
  return (
    <Routes location={location} >
      <Route path="/" element={<Outlet></Outlet>}>
        <Route
          index
          element={<UserListComponent></UserListComponent>}
        ></Route>
      </Route>
    </Routes>
  )
}

export default UserComponent;