import { gql } from 'apollo-boost'

const TAG_ALL = gql`
    query{
        tags
    }
`

export { TAG_ALL }