import { gql } from 'apollo-boost'

const TAG_ALL = gql`
    query{
        tags
    }
`

const TAG_SET = gql`
    mutation setImageTags(
        $id: ID!
        $tags: [String!]!
    ){
        setImageTags(id: $id, tags: $tags){
            _id
            url
            tags
        }
    }
`

export { TAG_ALL, TAG_SET }