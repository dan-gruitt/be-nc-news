const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
    return db
      .query(
        `
    SELECT * FROM articles
    WHERE article_id = $1
    `,
        [article_id]
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
        `
      SELECT 
      author, 
      title, 
      article_id, 
      topic, 
      created_at, 
      votes,
      article_img_url, 
      CAST 
      ((SELECT COUNT(*) 
      FROM comments 
      WHERE articles.article_id=comments.article_id) AS INTEGER) 
      AS comment_count 
      FROM articles 
      ORDER BY created_at
      `
      )
      .then(({ rows }) => {
        return rows;
      });
  };
  
  exports.fetchAllCommentsByArticleId = (article_id) => {
    return db
      .query(
        `
      SELECT * FROM comments
      WHERE article_id = $1
       ORDER BY created_at
      `,
        [article_id]
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ msg: "Comments not found" });
        } else {
          return rows;
        }
      });
  };