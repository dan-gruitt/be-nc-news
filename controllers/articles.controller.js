const { checkArticleIdExists } = require("../db/seeds/utils");
const {
  fetchArticleById,
  fetchAllCommentsByArticleId,
  fetchAllArticles,
  insertCommentByArticleId,
} = require("../models/articles.model");

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
      return res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchAllCommentsByArticleId(article_id)
    .then((comments) => {
      return res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  const checkingArticleExists = checkArticleIdExists(article_id);
  const addCommentQuery = insertCommentByArticleId(article_id, body);
  Promise.all([addCommentQuery, checkingArticleExists])
    .then((data) => {
      const finalComment = data[0];
      return res.status(201).send({ newComment: finalComment });
    })
    .catch((err) => {
      next(err);
    });
};
