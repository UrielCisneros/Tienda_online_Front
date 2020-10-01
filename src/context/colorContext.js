import React, { createContext, useState } from "react"

export const ColorContext = createContext('#FFF')

export const ColorProvider = ({ children }) => {
  const [color, setColor] = useState('#FFF');
  return (
    <ColorContext.Provider value={{color, setColor}}>
      {children}
    </ColorContext.Provider>
  );
};