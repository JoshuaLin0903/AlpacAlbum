const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
	url: {
        type: String,
        required: [true, "url field is required."],
        unique: true
    },
    tags: [String]
})

// Creating a table within database with the defined schema
const Image = mongoose.model('image', ImageSchema)

// Exporting table for querying and mutating
module.exports = Image