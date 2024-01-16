//const endPoints = require("../endpoints.json");
const { fetchEndPoint } = require("../models/endpoint.model");

exports.getEndpoints = (req, res, next) => {
  fetchEndPoint().then((data)=> {
    res.status(200).send(data);
  })


}
  
