const db = require("../db/connection");
const format = require("pg-format");

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

exports.fetchAllArticles = (query) => {
  const topic = query.topic;
  const validTopics = ["mitch", "cats", "paper", undefined];

 
  if (Object.keys(query).length !== 0) {
    if (!Object.keys(query).includes("topic")) {
      return Promise.reject({ msg: "Invalid query" });
    }
  }

  if (!validTopics.includes(topic)) {
    return Promise.reject({ msg: "Invalid topic" });
  }
  let queryMain = `
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
      FROM articles `;

  if (!topic) {
    queryMain += `ORDER BY created_at`;
  } else {
    queryMain += format(`WHERE topic = %L ORDER BY created_at`, topic);
  }
  return db.query(queryMain).then(({ rows }) => {
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

exports.insertCommentByArticleId = (article_id, newComment) => {
  const date = Date.now();
  const cleanDate = new Date(date);
  const sqlQuery = format(
    `
  INSERT INTO comments
  (body, votes, author, article_id, created_at)
  VALUES
  %L
  RETURNING *;
  `,
    [[newComment.body, 0, newComment.username, article_id, cleanDate]]
  );
  return db.query(sqlQuery).then(({ rows }) => {
    return rows[0];
  });
};

exports.updateArticleByArticleId = (article_id, inc_votes) => {
  return db
    .query(
      `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;
  `,
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ msg: "Article not found" });
      } else {
        return rows[0];
      }
    });
};
