import { gql } from 'apollo-boost'

const USER_SUBSCRIPTION = gql`
  subscription {
    user {
      mutation
      data {
        _id
        name
        email
      }
    }
  }
`

export { USER_SUBSCRIPTION }