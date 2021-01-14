const Subscription = {
    user: {
        subscribe: async(_, __, { pubsub }) => {
            return await pubsub.asyncIterator('user')
        }
    },
    album:{
        subscribe: async(_, args, { pubsub }) => {
            if(!args.tag) return await pubsub.asyncIterator('album')
            return await pubsub.asyncIterator(`album ${args.tag}`)
        }
    }
  }
  
  export { Subscription as default }