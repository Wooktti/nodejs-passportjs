const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const app = express();
const port = 3000;

app.use(helmet());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(compression());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore(),
  cookie: {
    httpOnly: true,
    secure: false,
  }
}));

app.get('*', function(request, response, next) {
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});

const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.use(function(req, res, next) {
  res.status(404).send(`Sorry can't find that!`);
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});