import { gql } from 'apollo-boost'

const IMAGE_QUERY = gql`
    query($tags: [String!]){
        images(tags: $tags){
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

export { IMAGE_CREATE, IMAGE_QUERY, ALBUM_PREVIEW, ALBUM_COUNT }