import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'

// setup MongoDB
require('dotenv-defaults').config()
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);

if (!process.env.MONGO_URL) {
  console.error('Missing MONGO_URL!!!')
  process.exit(1)
}

mongoose.connect(process.env.MONGO_URL, {
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
const session = require('express-session')
const { readFileSync } = require('fs')

const server = new ApolloServer({
  typeDefs: readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers: {
    Query,
    Mutation
  },
  context: ({ req, res }) => ({ req, res })
})

const app = express()

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

app.listen((process.env.PORT | 4000), () => {
  console.log(`The server is up on port ${process.env.PORT | 4000}${server.graphqlPath}!`)
})