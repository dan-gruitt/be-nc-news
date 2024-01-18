const { checkCommentExists } = require("../db/seeds/utils");
const { removeCommentByCommentId } = require("../models/comments.models");

exports.deleteCommentByCommentId = (req, res, next) => {
  const { comment_id } = req.params;
  const checkingCommentExists = checkCommentExists(comment_id)
  const deleteCommentQuery = removeCommentByCommentId(comment_id)
  Promise.all([deleteCommentQuery,checkingCommentExists])
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};



