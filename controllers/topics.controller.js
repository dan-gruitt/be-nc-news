const {
  fetchAllData,
  fetchArticleById,
  fetchAllArticles,
  fetchAllCommentsByArticleId,
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

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      return res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchAllCommentsByArticleId(article_id)
    .then((comments) => {
      return res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};
