import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Grid } from "@material-ui/core";
import { UserContext } from "../../context/userContext";
import { makeStyles } from "@material-ui/core/styles";

//context

const NavBar = () => {
  const { value1 } = useContext(UserContext);
  const [loginState, setloginState] = value1;
  const { userName, isAuth } = loginState;

  const resetAuth = () => {
    localStorage.removeItem("token");
    setloginState({ ...loginState, userName: "", isAuth: false, token: "" });
  };

  //Style
  const useStyles = makeStyles(theme => ({
    btn: {
      marginLeft: 20
    }
  }));
  const classes = useStyles();

  return (
    <AppBar position='static'>
      <Toolbar>
        <Grid container direction='row' justify='space-between' alignItems='flex-start'>
          <Typography variant='h6'>Mintbean Chat room</Typography>
          {isAuth ? (
            <div>
              {userName ? (
                <Typography variant='p'>Hello! {userName}.</Typography>
              ) : (
                <Typography variant='p'>Hello!</Typography>
              )}
              <Button
                className={classes.btn}
                variant='contained'
                color='inherit'
                onClick={() => resetAuth()}>
                LOGOUT
              </Button>
            </div>
          ) : null}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
