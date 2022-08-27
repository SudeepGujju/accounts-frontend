import React, { useContext, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../context";
import { Menu } from "primereact/menu";

import "./Navbar.component.css";
import { UserType } from "../../models";
import { eventBus } from "../../utils";

function NavbarComponent() {

  const userCtx = useContext(UserContext);

  const menu = useRef<any>(null);

  const menuItems = useMemo(() => {
    return [
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        command: function(){
          eventBus.dispatch('logout');
        }
      },
    ];
  }, []);

  let menuLinks;

  if(userCtx?.user?.userType === UserType.Admin){

    menuLinks = (
      <>
        <Link to="/user">User</Link>
        <Link to="/invoice-upload">Invoice (GSTR2) Upload</Link>
      </>
    )

  }else if(userCtx?.user?.userType === UserType.User){
    menuLinks = (
      <>
        <div><Link to="/account">Account</Link></div>
        <div><Link to="/group">Group</Link></div>
        <div><Link to="/bank">Bank Tansaction</Link></div>
        <div><Link to="/transaction">Transaction</Link></div>
        <div><Link to="/invoice">Invoice (GSTR2)</Link></div>
      </>
    )
  }

  return (
    <nav className="px-2 py-3 bg-blue-800 text-white drop-shadow-lg font-semibold text-xl">
      <div className="flex justify-between items-center mx-4">
        <div className="flex gap-8">
          {
            menuLinks
          }
        </div>
        <div className="flex justify-between items-center gap-2">
          <Menu model={menuItems} popup ref={menu} id="popup_menu" />
          <div
            className="cursor-pointer"
            onClick={(event) => menu.current.toggle(event)}
            aria-haspopup
            aria-controls="overlay_tmenu"
          >
            {userCtx?.user?.username} <i className="pi pi-bars"></i>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
