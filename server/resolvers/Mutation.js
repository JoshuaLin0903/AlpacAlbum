import { ObjectId } from 'mongodb'

const bcrypt = require('bcrypt');

const Image = require('../models/image')
const User = require('../models/user')
import {Comment} from '../models/comment'

const Mutation = {
    registerUser: async(_, args) => {
        const hashedpassword = await bcrypt.hash(args.password, 10)
        args.password = hashedpassword
        const user = new User(args)
        console.log(user)
        await user.save()

        return user
    },
    loginUser: async(_, args, {req}) => {
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
            let user_email
            user_email = await User.findOne({email: args.name})
            if(!user_email){
                throw new Error('User not found!')
            }
            else{
                const valid = await bcrypt.compare(args.password, user_email.password)
                if(!valid){
                    throw new Error('Invalid password!')
                }
                req.session.userId = user_email._id
                return user_email
            }
        }

        const valid = await bcrypt.compare(args.password, user.password)
        if(!valid){
            throw new Error ('Invaild password!')
        }
        req.session.userId = user._id
        
        return user
    },
    logoutUser: async(_, __, {req}) => {
        if(!req.session.userId){
            return false
        }
        req.session.destroy()

        return true
    },
    usernameChange: async(_, args, {req}) => {
        let user
        user = await User.findOne({name: args.name})
        if(!user){
            throw new Error('User not found!')
        }
        else{
            let checkUser
            checkUser = await User.findOne({name_new: args.name_new})
            if(checkUser){
                throw new Error('Username taken!')
            }
            else{
                user.name = args.name_new;
                user.save()
                return true;
            }
        }
    },
    avatarChange: async(_, args, {req}) => {
        const user = await User.findOne({name: args.name})
        if(!user){
            throw new Error('User not found!')
        }
        user.avatar = args.avatar_new
        user._id = user._id
        user.save()
        return true;
    },
    pwdCheck: async(_, args, {req}) => {
        let user
        user = await User.findOne({name: args.name})
        const valid = await bcrypt.compare(args.password, user.password)
        if(!valid){
            throw new Error ('Invaild password!')
            return false
        }
        else{
            if(args.password_new==""||args.password_new2==""){
                throw new Error ('Password cannot be empty')
            }
            else if(args.password_new!=args.password_new2){
                throw new Error ('Please confirm your new password')
            }
            else{
                const hashedpassword = await bcrypt.hash(args.password_new, 10)
                user.password = hashedpassword;
                user.save()
                return true;
            }
        }
    },
    createImage: async(_, args, {pubsub}) => {
        const newTags = [...new Set(args.data.tags)]
        args.data.tags = newTags
        args.data.comments = []
        const img = new Image(args.data)
        await img.save()

        return img
    },
    deleteImage: async(_, args, {pubsub}) => {
        if(!args.id){
            await Image.remove({ })
            throw new Error ('Delete all Image')
        }
        const img = await Image.findOneAndDelete({_id : ObjectId(args.id)})
        if(img === null){
            throw new Error ('Image not found')
        }
        return img
    },
    addImageTags: async(_, args, {pubsub}) => {
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
    deleteImageTags: async(_, args, {pubsub}) => {
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
    },
    setImageTags: async(_, args, {pubsub}) => {
        const img = await Image.findOneAndUpdate(
            {_id: ObjectId(args.id)},
            {tags: args.tags}
        )
        if(img === null){
            throw new Error('Image not found.')
        }
        return img
    },
    createComment: async(_, args) => {
        const cmt = new Comment({
            author: args.author,
            text: args.comment
        })

        const img = await Image.findOneAndUpdate(
            {_id: ObjectId(args.picID)},
            {$push: {comments: cmt} }
        )

        if(img === null){
            throw new Error('Image not found.')
        }
        return cmt
    },
    deleteComment: async(_, args) => {
        const img = await Image.findOneAndUpdate(
            {comments: {$elemMatch: {_id: args.id}}},
            {$pull: {comments: {_id: args.id}}},
            false
        )
        if(img === null){
            throw new Error ('Message not found')
        }
        return true
    }
}

export { Mutation as default }