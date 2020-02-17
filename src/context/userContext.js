import React, { createContext, useState } from "react";

export const UserContext = createContext();

//To Handdle state and comments globally
const UserProvider = props => {
  const [loginState, setLoginState] = useState({
    userName: "",
    isAuth: false,
    token: localStorage.getItem("token"),
    comments: []
  });

  return (
    <UserContext.Provider value={{ value1: [loginState, setLoginState] }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserProvider;
