const express = require("express");
const { getHealthCheck, getAllTopics } = require("./controllers/topics.controller");

const app = express();

app.get("/api/healthCheck",getHealthCheck );

app.get("/api/topics", getAllTopics);

module.exports = app;
