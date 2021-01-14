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
            return await Image.find().sort({$natural: -1})
        }
        if(args.tags.length === 0){
            throw new Error("Empty tags array.")
        }
        return await Image.find({ tags: { $all: args.tags } }).sort({$natural: -1})
    },
    albumPreview: async(_, args) => {
        if(!args.tag){
            return await Image.find().sort({$natural: -1}).limit(4)
        }
        return await Image.find({tags: args.tag}).sort({$natural: -1}).limit(4)
    },
    albumCount: async(_, args) => {
        if(!args.tag){
            return await Image.countDocuments()
        }
        return await Image.find({tags: args.tag}).countDocuments()
    },
    tags: async(_, args) => {
        if(!args.query){
            return await Image.distinct('tags')
        }
        const tags =  await Image.distinct('tags')
        return tags.filter(tag => {
            return tag.includes(args.query)
        })
    }
}

export { Query as default }