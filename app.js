const express = require("express");
const {
  getHealthCheck,
  getAllTopics,
  getArticleById,
  getAllArticles,
} = require("./controllers/topics.controller");

const { getEndpoints } = require("./controllers/endpoint.controller.js");

const app = express();

app.get("/api/healthCheck", getHealthCheck);

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

// PSQL error codes
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

// Promise.reject errors from models
app.use((err, req, res, next) => {
  if (err.msg === "Article not found") {
    res.status(404).send({ msg: err.msg });
  }

  if (err.msg === "Invalid query") {
    res.status(404).send({ msg: err.msg });
  }
});

// Server errors
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error, please try again" });
});

module.exports = app;
