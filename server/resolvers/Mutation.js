import { ObjectId } from 'mongodb'

const bcrypt = require('bcrypt');

const Image = require('../models/image')
const User = require('../models/user')

const Mutation = {
    registerUser: async(_, args) => {
        const hashedpassword = await bcrypt.hash(args.password, 10)
        args.password = hashedpassword
        const user = new User(args)
        await user.save()

        return user
    },
    loginUser: async(_, args, {req, pubsub}) => {
        if(!args.name && !args.email){
            throw new Error ('Should have either name or email to login.')
        }
        let user
        if(!args.email){
            user = await User.findOne({name: args.name})
        }
        else{
            user = await User.findOne({email: args.email})
        }

        if(!user){
            throw new Error ('User not found')
        }

        const valid = await bcrypt.compare(args.password, user.password)
        if(!valid){
            throw new Error ('Invaild password!')
        }
        req.session.userId = user._id

        pubsub.publish('user', {
            user: {
                mutation: 'LOGIN',
                data: user
            }
        })
        
        return user
    },
    logoutUser: async(_, __, {req, pubsub}) => {
        if(!req.session.userId){
            return false
        }
        req.session.destroy()

        pubsub.publish('user', {
            user: {
                mutation: 'LOGOUT',
                data: null
            }
        })

        return true
    },
    createImage: async(_, args) => {
        const newTags = [...new Set(args.data.tags)]
        args.data.tags = newTags
        const img = new Image(args.data)
        await img.save()

        return img
    },
    deleteImage: async(_, args) => {
        if(!args.id){
            await Image.remove({ })
            throw new Error ('Delete all message')
        }
        const msg = await Image.findOneAndDelete({_id : ObjectId(args.id)})
        if(msg === null){
            throw new Error ('Message not found')
        }
        return msg
    },
    addImageTags: async(_, args) => {
        if(args.tags.length === 0){
            throw new Error("Empty tags array.")
        }
        const img = await Image.findOneAndUpdate(
            {_id: ObjectId(args.id)},
            {$addToSet: {tags: {$each: args.tags}}},
            {new: true}
        )
        if(img === null){
            throw new Error('Image not found.')
        }
        return img
    },
    deleteImageTags: async(_, args) => {
        if(args.tags.length === 0){
            throw new Error("Empty tags array.")
        }
        const img = await Image.findOneAndUpdate(
            {_id: ObjectId(args.id)},
            {$pullAll: {tags: args.tags}},
            {new: true}
        )
        if(img === null){
            throw new Error('Image not found.')
        }
        return img
    }
}

export { Mutation as default }