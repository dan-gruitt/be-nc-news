const { fetchAllUsers } = require("../models/users.model");

exports.getAllUsers = (req,res,next) => {
  fetchAllUsers().then((users) => {
    return res.status(200).send({ users });
  }).catch((err)=> {
    next(err)
  })
};
