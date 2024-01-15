const express = require("express");
const {
  getHealthCheck,
  getAllTopics,
} = require("./controllers/topics.controller");

const app = express();

app.get("/api/healthCheck", getHealthCheck);

app.get("/api/topics", getAllTopics);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error, please try again" });
});

module.exports = app;
