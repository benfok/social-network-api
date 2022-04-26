const mongoose = require('mongoose');

// define the user schema
const userSchema = new mongoose.Schema(
    // object to define the fields
    {
        username: {
            type: String,
            required: [true, 'username is a required field'],
            unique: [true, 'A user with this username already exists'],
            trim: true,
            minlength: 2 // username must be at least 6 characters long
        },
        email: {
            type: String,
            required: [true, 'email is a required field'],
            unique: [true, 'This email is already in use'],
            trim: true,
            match: [/^([\w.!#$%&*+=?^_{|}~\/-]+)@([\w.-]+)\.([a-z.]{2,6})$/, 'Please fill a valid email address'] // matches the input to the RegEx
        },
        thoughts: [
            // creates an array of objects. This field is the Type of ObjectId (the Mongo specific id). The ref property connects this to the thought model.
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'thought'
        } 
        ],
        friends: [
            // creates an array of objects. This field is the Type of ObjectId (the Mongo specific id). The ref property connects this to the user model.
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            } 
        ]
    },
    // options object. Ensure that the virtuals are included.
    {
        toJSON: { virtuals: true }
    }
);

// Creating a virtual property `friendCount` and a getter
userSchema
    .virtual('friendCount')
    .get(function () {
        return this.friends.length
    });

// initialize the model
const User = mongoose.model('user', userSchema);

module.exports = User;