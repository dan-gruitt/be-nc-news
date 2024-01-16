const {
  fetchAllData,
  fetchArticleById,
  fetchAllArticles,
} = require("../models/topics.model");

exports.getHealthCheck = (req, res, next) => {
  res.status(200).send();
};

exports.getAllTopics = (req, res, next) => {
  fetchAllData()
    .then((data) => {
      return res.status(200).send({ topics: data });
    })
    .catch((err) => {
      log | (err, "<--- err inside controller catch block");
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleById(articleId)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles().then((articles) => {
    res.status(200).send(articles);
  });
};
