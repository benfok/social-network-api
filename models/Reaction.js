const mongoose = require('mongoose');
const { formatDate } = require('../utils/utils');
 
// Create reactions as a Schema within the Thought model
const reactionSchema = new mongoose.Schema(
    {
        reactionId: {
            type: mongoose.Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,        
            minlength: 1, // text must be between 1-280 characters long
            maxlength: 280
        },
        username: {
            type: String,
            required: [true, 'username is a required field'],
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: formatDate
        },
    },
    {
        toJSON: { getters: true },
        id: false
    }
);

module.exports = reactionSchema;