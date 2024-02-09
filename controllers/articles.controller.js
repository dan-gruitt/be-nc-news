const { checkArticleIdExists } = require("../db/seeds/utils");
const {
  fetchArticleById,
  fetchAllCommentsByArticleId,
  fetchAllArticles,
  insertCommentByArticleId,
  updateArticleByArticleId,
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
  const query = req.query
  fetchAllArticles(query)
  
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
  console.log(article_id, "<<< article id controller");
  const { body } = req;
  console.log(body, "<<< body controller");
  Promise.all([checkArticleIdExists(article_id), insertCommentByArticleId(article_id, body)])
    .then((data) => {
      console.log(data, "<<<< response data controller");
      const finalComment = data[1];
      console.log(finalComment, "<<<< final comment controller");
      return res.status(201).send({ newComment: finalComment });
    })
    .catch((err) => {
      console.log(err, "<<< error controller");
      next(err);
    });
};

exports.patchArticleByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleByArticleId(article_id, inc_votes).then((article) => {
    return res.status(200).send({ newArticle: article });
  }).catch((err)=> {
    next(err)
  })

};

