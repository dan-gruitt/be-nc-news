const express = require("express");
const {
  getHealthCheck,
  getAllTopics,
} = require("./controllers/topics.controller");
const app = express();

const { getEndpoints } = require("./controllers/endpoint.controller.js");
const {
  getArticleById,
  getAllArticles,
  getAllCommentsByArticleId,
  postCommentByArticleId,
  patchArticleByArticleId,
} = require("./controllers/articles.controller.js");
const { deleteCommentByCommentId } = require("./controllers/comments.controllers.js");

app.use(express.json());

app.get("/api/healthCheck", getHealthCheck);

app.get("/api/topics", getAllTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch('/api/articles/:article_id', patchArticleByArticleId)

app.delete('/api/comments/:comment_id',deleteCommentByCommentId)


// Promise.reject errors from models

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(404).send({ msg: err.msg });
  }
  next(err);
});

// PSQL error codes

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
});

// Server errors
app.use((err, req, res, next) => {
  res.status(500).send({ message: "Server Error, please try again" });
});

module.exports = app;
