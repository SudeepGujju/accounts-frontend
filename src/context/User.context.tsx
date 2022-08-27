import React, { useState } from "react";
import { CurrentUser } from "../models";
import { getUser } from "../services";

type UserContextType = {
  isLoggedIn: boolean;
  user: CurrentUser | null;
};

export const UserContext = React.createContext<UserContextType | null>(null);

export function UserContextProvider(props: React.PropsWithChildren<{}>) {

  const [user, setUser] = useState<CurrentUser | null>( getUser() );

  return (
    <UserContext.Provider
      value={{
        isLoggedIn: !!user,
        user
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}