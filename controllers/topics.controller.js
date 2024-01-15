const { fetchAllData } = require("../models/topics.model");

exports.getHealthCheck = (req, res, next) => {
  res.status(200).send();
};

exports.getAllTopics = (req, res) => {
  //invoke model
  fetchAllData()
    .then((data) => {
      //send response
      return res.status(200).send({ topics: data });
    })
    .catch((err) => {
        log|(err, "<--- err inside controller catch block")
      next(err);
    });
};
