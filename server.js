const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { readFileSync } = require('fs');

const Query = require('./server/resolvers/Query')
const Mutation = require('./server/resolvers/Mutation')

const port = process.env.PORT || 80;

const app = express();
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

// setup MongoDB
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);

mongoose.connect("mongodb+srv://public:public@cluster0.5jced.mongodb.net/cluster0?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection

db.on('error', (error) => {
  console.error(error)
})

db.once('open', () => {
  console.log('MongoDB connected!')
})

// setup GraphQL server
const server = new ApolloServer({
  typeDefs: readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers: {
    Query,
    Mutation
  },
  context: ({ req, res }) => ({ req, res })
})

app.use(session({
  secret: `oijwaeasdlkfj`,
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: (1825*86400*1000),
      httpOnly: true,
      sameSite: 'lax'
  }
}))


server.applyMiddleware({
  app,
  cors:{
    credentials: true,
    origin: true
  }
})

app.get('/ping', function (req, res) {
  return res.send('pong');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);
console.log("Server Ready!")

