import { GraphQLServer, PubSub } from 'graphql-yoga'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Subscription from './resolvers/Subscription'

// This is a replacement file for server.js
// If this file works, then we don't need server.js anymore

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

const pubsub = new PubSub()

const context = (req) => ({
    req: req.request,
    pubsub: pubsub
})

// opts
const opts = {
    port: process.env.PORT | 4000,
    cors: {
        credentials: true,
        origin: ['http://localhost:3000']
    }
};

const server = new GraphQLServer({
  typeDefs: './server/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription
  },
  context
})

server.express.use(session({
    secret: `oijwaeasdlkfj`,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825*86400*1000),
        httpOnly: true,
        sameSite: 'lax'
    }
}))

server.start(opts, () => {
  console.log(`The server is up on port ${process.env.PORT | 4000}!`)
})