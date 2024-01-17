const {
  fetchAllData,
} = require("../models/topics.model");

exports.getHealthCheck = (req, res, next) => {
  return res.status(200).send();
};

exports.getAllTopics = (req, res, next) => {
  fetchAllData()
    .then((data) => {
      return res.status(200).send({ topics: data });
    })
    .catch((err) => {
      next(err);
    });
};

