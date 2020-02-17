import React, { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import axios from "axios";

//component
import Comment from "../comment/commentComponent";

//Material Ui
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

//socketIo
import socketIOClient from "socket.io-client";
const endpoint = "http://localhost:5000/";
const socket = socketIOClient(endpoint);

const TopPage = () => {
  const { value1 } = useContext(UserContext);
  const [loginState, setloginState] = value1;
  const { isAuth, userName, comments } = loginState;
  const [commentState, setCommentState] = useState({ comment: "" });
  const { comment } = commentState;

  //To update comment realTime
  socket.on("comment", newComment => {
    setloginState({ ...loginState, comments: [...loginState.comments, newComment] });
  });

  const onChange = e => {
    setCommentState({ ...commentState, [e.target.name]: e.target.value });
  };

  //obtain comments
  useEffect(() => {
    const checkComment = async () => {
      axios
        .get("/comment")
        .then(res => {
          let test = res.data.sort(function compare(a, b) {
            var dateA = new Date(a.date);
            var dateB = new Date(b.date);
            return dateB - dateA;
          });
          setloginState({ ...loginState, comments: test });
        })
        .catch(err => {
          alert(err);
        });
    };
    checkComment();
  }, []);

  const submitComment = e => {
    e.preventDefault();
    axios
      .post("/comment", { comment, userName })
      .then(res => {
        // alert(res.data);
      })
      .then(() => {
        e.preventDefault();
        socket.emit("comment", { comment, userName });
      })
      .catch(err => {
        alert(err);
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
    commentArea: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      overflow: "scroll"
    },
    subBtn: {}
  }));

  const classes = useStyles();

  //If isAuth = false, redirect to top page
  if (!isAuth) {
    return <Redirect to='/' />;
  }
  return (
    <Grid container direction='column' justify='center' alignItems='center'>
      <Grid container direction='row' justify='center' alignItems='center'>
        <TextField
          className={classes.root}
          name='comment'
          value={comment}
          id='outlined-basic'
          label='comment'
          variant='outlined'
          onChange={e => onChange(e)}
          autoComplete='off'
        />
        <Button
          variant='contained'
          color='secondary'
          type='submit'
          className={classes.subBtn}
          onClick={e => submitComment(e)}>
          COMMENT
        </Button>
      </Grid>
      <Box id='commentBox' className={classes.commentArea}>
        {comments
          ? comments.map(comment => (
              <div id='message'>
                <Comment {...comment} />{" "}
              </div>
            ))
          : null}
      </Box>
    </Grid>
  );
};

export default TopPage;
