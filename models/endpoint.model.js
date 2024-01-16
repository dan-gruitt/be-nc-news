const fs = require("fs/promises");

exports.fetchEndPoint = () => {
  return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
    const fixedData = JSON.parse(data);
    return fixedData;
  });
};
