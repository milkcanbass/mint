import React, { Fragment, useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

//context
import { UserContext } from "../../context/userContext";

//materialUi
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const TopPage = () => {
  const { value1 } = useContext(UserContext);
  const [loginState, setloginState] = value1;
  const { isAuth } = loginState;
  const [userState, setUserState] = useState({ userName: "", password: "", signUpstate: true });
  const { userName, password, signUpstate } = userState;

  const resetAuth = () => {
    localStorage.removeItem("token");
    setloginState({ ...loginState, userName: "", isAuth: false, token: "" });
  };

  const registerAuth = (token, userName) => {
    localStorage.setItem("token", token);
    setloginState({ ...loginState, userName, isAuth: true, token });
  };

  const onChange = e => {
    setUserState({ ...userState, [e.target.name]: e.target.value });
  };

  const submitNameAndPass = e => {
    e.preventDefault();
    let signUpPath = signUpstate ? "/user/signup" : "/user/signin";

    const config = {
      headers: {
        "Content-type": "application/json"
      }
    };

    axios
      .post(signUpPath, { userName, password }, config)
      .then(res => {
        let token = res.data.token;
        let userName = res.data.userName;
        registerAuth(token, userName);
      })
      .catch(err => {
        resetAuth();
        alert(err.response.data);
      });
  };

  const changeSignUp = () => {
    setUserState({
      ...userState,
      signUpstate: !signUpstate
    });
  };

  //Styling Section
  const useStyles = makeStyles(theme => ({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: 300
      }
    },
    signinAndSignup: {
      cursor: "pointer"
    },
    grid: {
      marginTop: 50
    },
    signup: {
      width: 300
    },
    subBtn: {
      marginTop: 10
    }
  }));

  const classes = useStyles();

  //Redirect if user isAuth = true
  if (isAuth) {
    return <Redirect to='/chatroom' />;
  }
  return (
    <Fragment>
      <Grid
        className={classes.grid}
        container
        direction='column'
        justify='center'
        alignItems='center'>
        <Grid
          className={classes.signup}
          container
          direction='row'
          justify='space-evenly'
          alignItems='center'>
          <Typography
            variant='h5'
            className={classes.signinAndSignup}
            color={signUpstate ? "secondary" : "initial"}
            onClick={signUpstate ? null : () => changeSignUp()}>
            SignUp
          </Typography>

          <Typography
            variant='h5'
            className={classes.signinAndSignup}
            color={signUpstate ? "initial" : "secondary"}
            onClick={signUpstate ? () => changeSignUp() : null}>
            SignIn
          </Typography>
        </Grid>

        <TextField
          noValidate
          className={classes.root}
          name='userName'
          value={userName}
          id='outlined-basic'
          label='user name'
          variant='outlined'
          onChange={e => onChange(e)}
        />
        <TextField
          className={classes.root}
          name='password'
          value={password}
          id='outlined-basic'
          label='password'
          variant='outlined'
          onChange={e => onChange(e)}
          autoComplete='off'
        />
        <Button
          variant='contained'
          color='secondary'
          type='submit'
          className={classes.subBtn}
          onClick={e => submitNameAndPass(e)}>
          TO THE CHAT ROOM
        </Button>
      </Grid>
    </Fragment>
  );
};

export default TopPage;
