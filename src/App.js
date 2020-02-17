import React, { Fragment, useEffect, useContext } from "react";
import { Switch, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";

import Container from "@material-ui/core/Container";

//component
import TopPage from "./components/topPage/topPageComponent";
import ChatRoom from "./components/chatRoom/chatRoomComponent";
import NavBar from "./components/navBar/navBar";

//setToken
import { setAuthToken } from "./util/utils";

//context
import { UserContext } from "./context/userContext";

const App = () => {
  //context API
  const { value1 } = useContext(UserContext);
  const [loginState, setloginState] = value1;

  const resetAuth = () => {
    localStorage.removeItem("token");
    setloginState({ ...loginState, userName: "", isAuth: false, token: "" });
  };

  const registerAuth = (token, userName) => {
    localStorage.setItem("token", token);
    setloginState({ ...loginState, userName, isAuth: true, token });
  };

  //Check if user has token in localStorage, and set user data to state
  useEffect(() => {
    if (localStorage.token) {
      let token = localStorage.token;
      const checkToken = async () => {
        try {
          axios.post("/user/auth", { token }).then(res => {
            const { token, userName } = res.data;
            registerAuth(token, userName);
          });
          setAuthToken(localStorage.token);
        } catch (err) {
          resetAuth();
        }
      };
      checkToken();
    }
  }, []);

  return (
    <Fragment>
      <NavBar />
      <Switch>
        <Container>
          <Route exact path='/' component={TopPage} />
          <Route exact path='/chatroom' component={ChatRoom} />
        </Container>
      </Switch>
    </Fragment>
  );
};

export default App;
