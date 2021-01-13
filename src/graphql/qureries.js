import { gql } from 'apollo-boost'

export const USER_GET = gql`
    query{
        getUser{
            _id
            name
            email
        }
    }
`