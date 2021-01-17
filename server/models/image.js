const mongoose = require('mongoose')
const Schema = mongoose.Schema

import { CommentSchema } from './comment'

const ImageSchema = new Schema({
	url: {
        type: String,
        required: [true, "url field is required."],
        unique: true
    },
    tags: [String],
    author: {
        type: String,   // author _id
        required: [true, "author field is required."]
    },
    date: String,
    comments: [CommentSchema]
})

// Creating a table within database with the defined schema
const Image = mongoose.model('image', ImageSchema)

// Exporting table for querying and mutating
module.exports = Image