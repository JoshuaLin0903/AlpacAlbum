import { gql } from 'apollo-boost'

const USER_REGISTER = gql`
    mutation registerUser(
        $name: String!
        $email: String!
        $password: String!
        $avatar: String!
    ){
        registerUser(
            name: $name
            email: $email
            password: $password
            avatar: $avatar
        ){
            _id
            name
            email
            avatar
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
            avatar
        }
    }
`

const USER_LOGIN = gql`
    mutation loginUser(
        $name: String
        $email: String
        $password: String!
        $avatar: String
    ) {
        loginUser(
            name: $name
            email: $email
            password: $password
            avatar: $avatar
        ){
            _id
            name
            email
            avatar
        }
    }
`
const AVATAR_CHANGE = gql`
    mutation avatarChange(
        $name: String
        $avatar: String
        $avatar_new: String!
    ) {
        avatarChange(
            name: $name
            avatar: $avatar
            avatar_new: $avatar_new
        ){
            _id
            name
            email
            avatar
        }
    }
`
const PWD_CHECK = gql`
    mutation pwdCheck(
        $name: String
        $password: String!
        $password_new: String!
        $password_new2: String!
    ) {
        pwdCheck(
            name: $name
            password: $password
            password_new: $password_new
            password_new2: $password_new2
        ){
            _id
            name
            email
            avatar
        }
    }
`

const USER_LOGOUT = gql `
    mutation logoutUser{
        logoutUser
    }
`

export { USER_GET, USER_GET_ALL, USER_LOGIN, USER_LOGOUT, USER_REGISTER, PWD_CHECK,AVATAR_CHANGE }