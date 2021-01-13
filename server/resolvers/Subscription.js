const Subscription = {
    user: {
        subscribe(_, __, { pubsub }) {
            return pubsub.asyncIterator('user')
        }
    }
  }
  
  export { Subscription as default }