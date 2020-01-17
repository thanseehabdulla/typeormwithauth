import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as multer from "multer";
import * as passport from "passport";
import * as passportJWT from "passport-jwt";
import { Request, Response } from "express";
import Routes from "./routes";
import UserController from "./controller/UserController";
var upload = multer({ dest: "uploads/" });
const jwt = require("jsonwebtoken");

createConnection().then(async connection => {
  // create express app

  // ExtractJwt to help extract the token
  let ExtractJwt = passportJWT.ExtractJwt;
  // JwtStrategy which is the strategy for the authentication
  let JwtStrategy = passportJWT.Strategy;
  let jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "wowwow"
  };

  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(upload.none());

  // lets create our strategy for web token
  let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log("payload received", jwt_payload);
    let user = UserController.getToken({ id: jwt_payload.id });
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  });
  // use the strategy
  passport.use(strategy);
  app.use(passport.initialize());

  // POST /test
  app.post("/test", function(req: Request, res: Response) {
      console.log("logger",req.body.firstName)
    res.send("welcome, " + req.body.firstName);
  });

  // GET /test
  app.get("/test", function(req: Request, res: Response, next) {
    UserController.getAll(req, res, next).then(data => res.json(data));
  });

  // GET Route Tst /Routetest
  app.use("/routetest", function(req: Request, res: Response, next) {
    Routes.getAll(req, res, next);
  });

  //Test passport
  app.post("/testpassport-a", async function(req: Request, res: Response, next) {
    const { firstName } = req.body;
    if (firstName) {
      // we get the user with the name and save the resolved promise
      let user = await UserController.getUser({ firstName });
      if (!user) {
        res.status(401).json({ msg: "No such user found", user });
      }
      if (user.firstName === firstName) {
        // from now on we’ll identify the user by the id and the id is
        // the only personalized value that goes into our token
        let payload = { id: user.id };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        res.json({ msg: "ok", token: token, user });
      } else {
        res.status(401).json({ msg: "Password is incorrect" });
      }
    } else {
      res.status(401).json({ msg: "no body" });
    }
  });

  // test protected route
  app.get(
    "/testpassport",
    passport.authenticate("jwt", { session: false }),
    function(req, res) {
      res.json({
        msg: "Congrats! You are seeing this because you are authorized"
      });
    }
  );

  // setup express app here
  // start express server
  app.listen(3000);

  console.log(
    "Express server has started on port 3000. Open http://localhost:3000/users to see results"
  );
});
