const mongoose = require('mongoose');
const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => {
                return res.status(200).json(thoughts);
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },

    // get a single thought
    getThoughtById(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select(['-__v'])
            .then((thought) => 
                !thought   
                    ? res.status(404).json({message: 'No thought exists with this ID'})
                    : res.status(200).json(thought)
            )
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            })
    },

    // create a thought
    // req.body example: {"thoughtText": "Here's a cool thought...", "userId": "5edff358a0fcb779aa7b118b" }      
    createThought(req, res) {
        // first check that the user exists, because a thought cannot exist without a valid userId
        User.findOne({ _id: req.body.userId })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'No user with that ID exists. Thought cannot be created.' })
            } else {
                Thought.create({  // create the thought
                    thoughtText: req.body.thoughtText,
                    username: user.username
                })    
                .then((thought) => {
                    return User.findOneAndUpdate(  //
                        { _id: req.body.userId},
                        { $addToSet: { thoughts: thought._id } },
                        { runValidators: true, new: true } // run validation on data entry and return newly updated instance of User
                    );
                })
                .then((thought) => res.status(200).json(thought))
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json(err);
                })
            }
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
        })
    },

    // update a thought by Id Only allowing thoughtText
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: { thoughtText: req.body.thoughtText } },
            { runValidators: true, new: true } // run validation on data entry and return newly updated instance of Thought
        )
            .then((thought) =>
            !thought
                ? res.status(404).json({ message: 'No thought exists with that ID' })
                : res.status(200).json(thought)
            )
            .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
            });
        },

    // delete a thought by Id
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) => {
                if(!thought) {
                        return res.json({ message: 'No thought exists with this ID'}) 
                } else {
                        User.findOneAndUpdate(
                            { username: thought.username },
                            { $pull: { thoughts: req.params.thoughtId } },
                            { runValidators: true, new: true } // run validation on data entry and return newly updated instance of User
                        )
                    .then((user) =>
                        !user
                        ? res.status(404).json({ message: 'Thought deleted, but no user found with the associated user ID' })
                        : res.status(200).json({ message: 'Thought successfully deleted and removed from user record' })
                    )
                    .catch((err) => {
                        console.log(err);
                        return res.status(500).json(err);
                    });
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            })
        },

      // add a reaction
      addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true } // run validation on data entry and return newly updated instance of Thought
        )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: ' A thought with this ID does not exist'})
                : res.status(200).json(thought)
        )
        .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
        });        
      },

      // delete a reaction
      deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: mongoose.Types.ObjectId(req.body.reactionId) } } },
            { runValidators: true, new: true } // run validation on data entry and return newly updated instance of Thought
        )
        .then((thought) =>
            !thought
                ? res.status(404).json({ message: ' A thought with this ID does not exist'})
                : res.status(200).json(thought)
        )
        .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
        });        
      },

    
}