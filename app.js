const express = require("express");
const {
  getHealthCheck,
  getAllTopics,
} = require("./controllers/topics.controller");

const {getEndpoints}= require("./controllers/endpoint.controller.js")

const app = express();

app.get("/api/healthCheck", getHealthCheck);

app.get("/api/topics", getAllTopics);

app.get("/api",getEndpoints);

app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error, please try again" });
});

module.exports = app;
