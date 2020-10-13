import React, { createContext, useState } from "react"

export const MenuContext = createContext()

export const MenuProvider = ({ children }) => {
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(true);
  return (
    <MenuContext.Provider value={{active,setActive, loading, setLoading}}>
      {children}
    </MenuContext.Provider>
  );
};