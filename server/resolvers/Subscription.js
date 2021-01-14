const { withFilter } = require('graphql-yoga');

const Subscription = {
    album:{
        subscribe: withFilter((_, __, {pubsub}) => pubsub.asyncIterator(['album']),
            (payload, variables) => {
                console.log("subscribe")
                if(!variables.tag) return true
                return payload.album.tags.includes(variables.tag)  
            }
        )
    }
}

export { Subscription as default }