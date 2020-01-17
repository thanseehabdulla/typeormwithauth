import UserController from "./controller/UserController";
var express = require("express");
var router = express.Router();

const Routes = {
  /* GET users listing. */
  getAll: router.get("/user", function(req, res, next) {
    UserController.getAll(req, res, next).then(data => res.json(data));
  })
};

export default Routes;
