require('@babel/register');

var http = require('http');
const expressWs = require('express-ws');
const session = require('express-session');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const prerender = require('prerender');

const indexRouter = require('./routes/index');
const fileRouter = require('./routes/file');
const feedbackRouter = require('./routes/feedback');
const initDb = require('./initDb').default;
const config = require('../config');
const WebSocketServer = require('./WebSocketServer').default;
const cache = require('./common/cache');

initDb();

const app = express();

const server = http.createServer(app);

// Middlewares
app.use(session({
  name: 'deershare.sid',
  secret: 'deershare2019',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
  },
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(__dirname, '../'), 'public')));
app.use(require('prerender-node')
  .set('prerenderServiceUrl', `http://localhost:${config.prerender.port}`)
  .set('beforeRender', (req, done) => {
    done(null, cache.get(req.url));
  })
  .set('afterRender', (err, req, prerenderRes) => {
    if (!err) {
      const scriptStr = `<script src="${config.publicPath}/js/index.bundle.js"></script>`;
      const body = prerenderRes.body.replace(scriptStr, '');
      cache.set(req.url, body);
    }
  }));

// WebSocket
const wsInstance = expressWs(app, server);
const wss = new WebSocketServer(wsInstance.getWss());
app.ws('/ws', function(ws, req) {
  wss.onConnection(ws, req);
});

// view engine setup
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
app.set('view engine', 'pug');

app.locals.publicPath = config.publicPath;

// Routers
app.use('/', indexRouter);
app.use('/api/file', fileRouter);
app.use('/api/feedback', feedbackRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Create HTTP server.
 */

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(config.port);
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
  console.log('Starting prerender');
  if (config.prerender.enabled) {
    prerender({
      port: config.prerender.port,
    }).start();
  }
}
