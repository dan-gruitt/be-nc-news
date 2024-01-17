const db = require("../db/connection");

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

