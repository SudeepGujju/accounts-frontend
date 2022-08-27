import React, { useState } from "react";

type AppContext = {
  displayLoader: boolean;
  setDisplayLoader: (show: boolean) => void;
};

export const AppContext = React.createContext<AppContext|null>(null);

export function AppContextProvider(props: React.PropsWithChildren<{}>) {
  const [displayLoader, setDisplayLoader] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ displayLoader, setDisplayLoader }}>
      {props.children}
    </AppContext.Provider>
  );
}