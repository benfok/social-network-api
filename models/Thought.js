const mongoose = require('mongoose');
const reactionSchema = require('./Reaction');
const { formatDate } = require('../utils/utils');
 
// define the user schema
const thoughtSchema = new mongoose.Schema(
    {
        thoughtText: {
            type: String,
            required: [true, 'thoughtText is a required field'],
            minlength: 1, // text must be between 1-280 characters long
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: formatDate
        },
        username: {
            type: String,
            required: [true, 'username is a required field'],
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: { getters: true },
    }
);


// initialize the Thought model
const Thought = mongoose.model('thought', thoughtSchema);

module.exports = Thought;