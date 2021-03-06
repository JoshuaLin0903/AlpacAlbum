const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "name field is required."],
        unique: true
    },
	email: {
        type: String,
        required: [true, "email field is required."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password field is required."]
    },
    avatar: {
        type: String,
        required: [true, "avatar field is required."]
    }
})

// Creating a table within database with the defined schema
const User = mongoose.model('user', UserSchema)

// Exporting table for querying and mutating
module.exports = User