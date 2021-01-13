const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TagSchema = new Schema({
    name: {
        type: String,
        required: [true, "name field is required."],
        unique: true
    },
	count: {
        type: Number,
        required: [true, "count field is required."]
    }
})

// Creating a table within database with the defined schema
const Tag = mongoose.model('tag', TagSchema)

// Exporting table for querying and mutating
module.exports = Tag