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
