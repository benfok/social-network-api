const { User } = require('../models');

module.exports = {
    // Get all users
    getUsers(req, res) {
      User.find()
        .then((users) => {
          return res.status(200).json(users);
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    // Get a single user. Requires that the user id 'userId' be passed in the URL
    getUserById(req, res) {
      User.findOne({ _id: req.params.userId })
        .select(['-__v']) // exclude version number from the return
        .populate('thoughts')
        .populate({
          path: 'friends',
          select: ['-__v'] // exclude version number from the returned friend data
        })
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user with that ID' })
            : res.status(200).json(user)
        )
       .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    // create a new user. Requires username and email passed as an object
    createUser(req, res) {
      User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    // update a user. Only allowing email to be updated
    updateUser(req, res) {
      User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: { email: req.body.email } },
        { runValidators: true, new: true }
      )
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user exists with that ID' })
            : res.status(200).json(user)
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    // Delete a user and remove their thoughts. Requires that the user id 'userId' be passed in the URL
    deleteUser(req, res) {
      User.findOneAndRemove({ _id: req.params.userId })
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user exists with that ID' })
            : Thought.deleteMany({ _id: { $in: user.thoughts } }) // if the user exists, delete associated thoughts from the Thoughts document where the id is present in the user.thoughts array
            )
        .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },
  
    // Add a friend to a user. Requires that the user id 'userId' and the friend id 'friendId' be passed in the URL
    addFriend(req, res) {
      console.log(req.body);
      User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      )
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user found with that ID' })
            : res.status(200).json(user)
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },

    // Remove a friend from a user's friend list. Requires that the user id 'userId' and the friend id 'friendId' be passed in the URL
    removeFriend(req, res) {
      User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      )
        .then((user) =>
          !user
            ? res.status(404).json({ message: 'No user found with that ID' })
            : res.status(200).json(user)
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },
  };