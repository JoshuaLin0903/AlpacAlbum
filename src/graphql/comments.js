import { gql } from 'apollo-boost'

const COMMENT_CREATE = gql`
    mutation createComment(
        $picID: ID!
        $author: ID!
        $comment: String!
    ){
        createComment(
            picID: $picID
            author: $author
            comment: $comment
        )
    }
`
const COMMENT_DELETE = gql`
    mutation deleteComment(
        $picID: ID!
        $author: ID!
        $comment: String!
    ){
        deleteComment(
            picID: $picID
            author: $author
            comment: $comment
        )
    }
`

export { COMMENT_CREATE,COMMENT_DELETE }