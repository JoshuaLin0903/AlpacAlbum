import { gql } from 'apollo-boost'

const USER_REGISTER = gql`
    mutation registerUser(
        $name: String!
        $email: String!
        $password: String!
    ){
        registerUser(
            name: $name
            email: $email
            password: $password
        ){
            _id
            name
            email
        }
    }
`

const USER_GET_ALL = gql`
    query{
        getUsers{
            _id
            name
        }
    }
`

const USER_GET = gql`
    query{
        getUser{
            _id
            name
            email
        }
    }
`

const USER_LOGIN = gql`
    mutation loginUser(
        $name: String
        $email: String
        $password: String!
    ) {
        loginUser(
            name: $name
            email: $email
            password: $password
        ){
            _id
            name
            email
        }
    }
`
const PWD_CHECK = gql`
    mutation pwdCheck(
        $name: String
        $password: String!
    ) {
        pwdCheck(
            name: $name
            password: $password
        ){
            _id
            name
            email
        }
    }
`

const USER_LOGOUT = gql `
    mutation logoutUser{
        logoutUser
    }
`

export { USER_GET, USER_GET_ALL, USER_LOGIN, USER_LOGOUT, USER_REGISTER, PWD_CHECK }