let express = require('express');
let path = require('path');
let handlebars = require('express-handlebars');
let cookieSession = require('cookie-session');
let app = express()

app.root = (...args) => path.join(__dirname, ...args);

app.inEnvironment = (env) => app.get('env') === env;
app.inProduction = () => app.inEnvironment('production');
app.inTesting = () => app.inEnvironment('testing');
app.inDevelopment = () => app.inEnvironment('development');

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = app.get('env');
}

if (process.env.EXPRESS_SESSION_SECRET) {
  app.set('session-secret', process.env.EXPRESS_SESSION_SECRET);
} else {
  app.set('session-secret', 'this-is-a-bad-secret');
}

app.set('view engine', 'hbs');
app.engine('hbs', handlebars({
  extname: 'hbs',
  defaultLayout: 'main'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let sessionHandler = cookieSession({
  name: 'session',
  secret: app.get('session-secret'),
});

app.use(sessionHandler);

let Knex = require('knex');
let dbConfig = require(app.root('knexfile'));
let knex = Knex(dbConfig[process.env.NODE_ENV]);
let { Model } = require('objection');
Model.knex(knex);

let loadUser = require('./loadUser');
app.use(loadUser);

let routes = require('./routes');
app.use('/', routes);

app.listen(8000, () => {
  console.log("listening on Port 8000");
});
