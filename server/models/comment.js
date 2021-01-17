const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    author: {
        type: String,   // author _id
        required: [true, "author field is required."]
    },
	text: {
        type: String,
        required: [true, "text field is required."]
    }
})

// Creating a table within database with the defined schema
const Comment = mongoose.model('message', CommentSchema)

// Exporting table for querying and mutating
module.exports = { Comment, CommentSchema }