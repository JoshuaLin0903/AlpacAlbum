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

export { COMMENT_CREATE }