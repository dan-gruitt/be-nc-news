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

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT author, title, article_id, topic, created_at, votes, article_img_url, CAST ((SELECT COUNT(*) FROM comments WHERE articles.article_id=comments.article_id) AS INTEGER) AS comment_count FROM articles ORDER BY created_at`
    )
    .then(({ rows }) => {
      return rows;
    });
};
