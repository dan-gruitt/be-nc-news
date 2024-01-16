const express = require("express");
const {
  getHealthCheck,
  getAllTopics,
  getArticleById,
  getAllArticles,
  getAllCommentsByArticleId,
} = require("./controllers/topics.controller");

const { getEndpoints } = require("./controllers/endpoint.controller.js");

const app = express();

app.get("/api/healthCheck", getHealthCheck);

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);


// PSQL error codes
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    next(err);
  }
});

// Promise.reject errors from models
app.use((err, req, res, next) => {
  if (
    err.msg === "Article not found" ||
    err.msg === "Comments not found" ||
    err.msg === "Invalid query"
  ) {
    res.status(404).send({ msg: err.msg });
  } else {
    next(err)
  }
});

// Server errors
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error, please try again" });
});

module.exports = app;
