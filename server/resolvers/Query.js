const User = require('../models/user')
const Image = require('../models/image')

const Query = {
    getUser: async(_, __, {req}) => {
        console.log("in getUser:", req.session)
        if(!req.session.userId){
            return null
        }
        return await User.findOne({_id: req.session.userId})
    },
    images: async(_, args) => {
        if(!args.tags){
            return await Image.find()
        }
        if(args.tags.length === 0){
            throw new Error("Empty tags array.")
        }
        return await Image.find({ tags: { $all: args.tags } })
    }
}

export { Query as default }