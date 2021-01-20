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
        ){
            _id
        }
    }
`
const COMMENT_DELETE = gql`
    mutation deleteComment($id: ID!){
        deleteComment( id: $id )
    }
`

export { COMMENT_CREATE,COMMENT_DELETE }