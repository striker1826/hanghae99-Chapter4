const express = require('express');
const app = express();

const port = 3000;

const usersRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const postRouter = require("./routes/posts");
const commentRouter = require('./routes/comments');



app.use(express.json());

app.use('/signup', usersRouter);
app.use('/login', loginRouter);
app.use('/posts', postRouter);
app.use('/comments', commentRouter);

app.use('/', (req, res) => {
    res.send('hello!')
})

app.listen(port, () => {
    console.log(`${port}번 포트로 열렸습니다.`)
})
