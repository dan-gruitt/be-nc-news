const db = require("../db/connection");
const data = require("../db/data/test-data");

exports.fetchAllData = () => {
  return db
    .query(
      `
    SELECT * FROM topics;
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (articleId) => {
  return db
    .query(
      `
  SELECT * FROM articles
  WHERE article_id = $1
  `,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "Article not found" });
      } else {
        return rows[0];
      }
    });
};
