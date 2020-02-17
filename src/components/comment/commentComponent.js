import React, { useContext, useState } from "react";
import moment from "moment";
import axios from "axios";
import { UserContext } from "../../context/userContext";
//Material Ui
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import socketIOClient from "socket.io-client";
const endpoint = "http://localhost:5000/";
const socket = socketIOClient(endpoint);

const Comment = props => {
  let { comment, _id, like, date, commentUserName } = props;
  const [thisLikeState, setThisLikeState] = useState({ thisLike: like });
  let { thisLike } = thisLikeState;
  //change date format
  date = moment(date).format("YYYY-MM-DD hh:mm");

  const { value1 } = useContext(UserContext);
  const [loginState] = value1;
  const { userName } = loginState;

  socket.on("like", likeChanged => {
    if (likeChanged._id === _id) {
      setThisLikeState({ thisLike: true });
    }
  });

  const submitLike = e => {
    e.preventDefault();
    axios
      .put("/comment", {
        _id
      })
      .then(response => {
        // alert("Liked!");
      })
      .catch(err => {
        alert(err.response.data);
      });
  };

  //Styling
  const useStyles = makeStyles(theme => ({
    wrapper: {
      padding: theme.spacing(1),
      width: 500
    },
    userWrapper: {
      padding: theme.spacing(1),
      width: 500,
      backgroundColor: "LightGreen"
    },
    comment: {
      textOverflow: "break-word",
      whiteSpace: "nowrap",
      width: "100%",
      overflow: "hidden"
    },
    subBtn: {}
  }));

  const classes = useStyles();

  return (
    <Grid
      className={userName === commentUserName ? classes.userWrapper : classes.wrapper}
      container
      direction='column'
      justify='center'
      alignItems='flex-start'>
      <Typography className={classes.commentUserName} variant='h5' color='primary'>
        {commentUserName}
      </Typography>
      <Typography className={classes.comment} variant='h5'>
        {comment}
      </Typography>
      <Typography variant='caption'>{date} </Typography>

      {thisLike ? (
        <Button
          variant='contained'
          color='default'
          type='submit'
          className={classes.subBtn}
          disabled>
          LIKED
        </Button>
      ) : (
        <Button
          variant='contained'
          color='primary'
          type='submit'
          className={classes.subBtn}
          onClick={e => submitLike(e)}>
          LIKE!
        </Button>
      )}
    </Grid>
  );
};

export default Comment;
