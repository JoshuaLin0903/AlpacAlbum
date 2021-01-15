import { gql } from 'apollo-boost'

const IMAGE_QUERY = gql`
    query($tags: [String!], $num: Int){
        images(tags: $tags, num: $num){
            _id
            url
            tags
        }
    }
`

const IMAGE_CREATE = gql`
    mutation createImage(
        $url: String!
        $tags: [String!]
    ) {
        createImage(data:{
            url: $url
            tags: $tags
        }){
            url
            tags
        }
    }
`

const IMAGE_DELETE = gql`
    mutation deleteImage(
        $id: ID!
    ) {
        deleteImage(id: $id){
            url
            tags
        }
    }
`

const ALBUM_PREVIEW = gql`
    query($tag: String){
        albumPreview(tag: $tag){
            url
        }
    }
`

const ALBUM_COUNT = gql`
    query($tag: String){
        albumCount(tag: $tag)
    }
`

const ALBUM_SUBSCRIPTION = gql`
    subscription($tag: String) {
        album(tag: $tag) {
            _id
            url
            tags
        }
    }
`

export { IMAGE_CREATE, IMAGE_QUERY, IMAGE_DELETE, ALBUM_PREVIEW, ALBUM_COUNT, ALBUM_SUBSCRIPTION }