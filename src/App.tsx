import React, { Suspense, useContext, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import "./App.css";

// import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/themes/tailwind-light/theme.css"; //theme - tailwind
// import "primereact/resources/themes/mdc-light-indigo/theme.css";  //theme - material design
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import { AppContext, UserContext } from "./context";
import { NavbarComponent } from "./components";
import { UserType } from "./models";

import LoginComponent from "./pages/login/Login.component";
import { logoutUser } from "./api";
import { AlertComponent, removeUser, removeUserToken } from "./services";
import { eventBus } from "./utils";

import { ProgressSpinner } from "primereact/progressspinner";

const HomeComponent = React.lazy(() => import("./pages/home/Home.component"));
const UserComponent = React.lazy(() => import("./pages/user/User.component"));
const UserDialogComponent = React.lazy(
  () => import("./pages/user/UserDialog.component")
);
const GroupComponent = React.lazy(
  () => import("./pages/group/Group.component")
);
const GroupDialogComponent = React.lazy(
  () => import("./pages/group/GroupDialog.component")
);
const AccountComponent = React.lazy(
  () => import("./pages/account/Account.component")
);
const AccountDialogComponent = React.lazy(
  () => import("./pages/account/AccountDialog.component")
);
const FileUploadComponent = React.lazy(
  () => import("./components/file/FileUpload.component")
);
const TransactionComponent = React.lazy(
  () => import("./pages/transaction/Transaction.component")
);
const TransactionDialogComponent = React.lazy(
  () => import("./pages/transaction/TransactionDialog.component")
);
const InvoiceComponent = React.lazy(
  () => import("./pages/invoice/Invoice.component")
);
const CustomerSalesComponent = React.lazy(
  () => import("./pages/customerSales/CustomerSales.component")
);
const BankTransactionComponent = React.lazy(
  () => import("./pages/bankTransaction/BankTransaction.component")
);
const BankTransactionDialogComponent = React.lazy(
  () => import("./pages/bankTransaction/BankTransactionDialog.component")
);

function App(): JSX.Element {
  const userCtx = useContext(UserContext);
  const appCtx = useContext(AppContext);
  const location = useLocation();

  const state = location.state as { backgroundLocation?: Location };

  const backgroundPageLocation = state?.backgroundLocation || location;
  const dialogLocation = state?.backgroundLocation;

  useEffect(() => {

    const clearUser = () => {
      removeUser();
      removeUserToken();
      window.location.reload();
    }

    const logout = () => {
      logoutUser().then( clearUser ).catch( clearUser );
    };

    eventBus.on("logout", logout);

    return () => {
      eventBus.remove("logout", logout);
    };
  }, []);

  return (
    <>
      <div>
        {!userCtx?.isLoggedIn && (
          <Routes>
            <Route path="login" element={<LoginComponent />}></Route>
            <Route path="*" element={<Navigate to="/login" replace />}></Route>
          </Routes>
        )}
        {userCtx?.isLoggedIn && (
          <>
            <NavbarComponent></NavbarComponent>
            {userCtx?.user?.userType === UserType.Admin && (
              <>
                <Routes location={backgroundPageLocation}>
                  <Route
                    path="/user/*"
                    element={
                      <Suspense fallback={<></>}>
                        <UserComponent location={backgroundPageLocation} />
                      </Suspense>
                    }
                  ></Route>
                  <Route
                    path="/invoice-upload"
                    element={
                      <Suspense fallback={<></>}>
                        <InvoiceComponent location={backgroundPageLocation}/>
                      </Suspense>
                    }
                  ></Route>
                  <Route
                    path="/customer-sales"
                    element={
                      <Suspense fallback={<></>}>
                        <CustomerSalesComponent location={backgroundPageLocation}/>
                      </Suspense>
                    }
                  ></Route>
                  <Route
                    path="*"
                    element={<Navigate to="/user" replace />}
                  ></Route>
                </Routes>
                {dialogLocation && (
                  <Routes>
                    <Route path="/dialog/*">
                      <Route
                        path="user/*"
                        element={
                          <Suspense fallback={<></>}>
                            <UserDialogComponent />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="upload"
                        element={
                          <Suspense fallback={<></>}>
                            <FileUploadComponent />
                          </Suspense>
                        }
                      ></Route>
                    </Route>
                  </Routes>
                )}
              </>
            )}
            {userCtx?.user?.userType === UserType.User && (
              <>
                <Routes location={backgroundPageLocation}>
                  {/* <Route
                    path="/"
                    element={
                      <Suspense fallback={<></>}>
                        <HomeComponent />
                      </Suspense>
                    }
                  ></Route> */}
                  <Route
                    path="/"
                    element={<Navigate to="/invoice" replace />}
                  ></Route>
                  <Route
                    path="/group/*"
                    element={
                      <Suspense fallback={<></>}>
                        <GroupComponent location={backgroundPageLocation} />
                      </Suspense>
                    }
                  ></Route>
                  <Route
                    path="/account/*"
                    element={
                      <Suspense fallback={<></>}>
                        <AccountComponent location={backgroundPageLocation} />
                      </Suspense>
                    }
                  ></Route>
                  <Route
                    path="/transaction/*"
                    element={
                      <Suspense fallback={<></>}>
                        <TransactionComponent location={backgroundPageLocation} />
                      </Suspense>
                    }
                  ></Route>
                  <Route
                    path="/bank/*"
                    element={
                      <Suspense fallback={<></>}>
                        <BankTransactionComponent location={backgroundPageLocation} />
                      </Suspense>
                    }
                  ></Route>
                  <Route
                    path="/invoice/*"
                    element={
                      <Suspense fallback={<></>}>
                        <InvoiceComponent location={backgroundPageLocation}/>
                      </Suspense>
                    }
                  ></Route>
                  <Route path="*" element={<Navigate to="/" replace />}></Route>
                </Routes>
                {dialogLocation && (
                  <Routes>
                    <Route path="/dialog/*">
                      <Route
                        path="group/*"
                        element={
                          <Suspense fallback={<></>}>
                            <GroupDialogComponent />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="account/*"
                        element={
                          <Suspense fallback={<></>}>
                            <AccountDialogComponent />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="transaction/*"
                        element={
                          <Suspense fallback={<></>}>
                            <TransactionDialogComponent />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="bank/*"
                        element={
                          <Suspense fallback={<></>}>
                            <BankTransactionDialogComponent />
                          </Suspense>
                        }
                      ></Route>
                      <Route
                        path="upload"
                        element={
                          <Suspense fallback={<></>}>
                            <FileUploadComponent />
                          </Suspense>
                        }
                      ></Route>
                    </Route>
                  </Routes>
                )}
              </>
            )}
          </>
        )}
        <AlertComponent></AlertComponent>
      </div>
      {appCtx?.displayLoader && (
        <div className="w-screen h-screen fixed top-0 left-0 z-[10000] bg-slate-300/30">
          <ProgressSpinner className="inset-1/2 -translate-x-1/2 w-[30%] h-[30%] top-1/2 left-1/2" />
        </div>
      )}
    </>
  );
}

export default App;
