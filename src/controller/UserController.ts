import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

const UserController = {
  getAll: async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    return User.find();
  },
  getToken: async (id) => {
    return User.findOne(id);
  },
  getUser: async (username) => {
    return User.findOne(username);
  },
  getOne: async (request: Request, response: Response, next: NextFunction) => {
    return User.findOne(request.params.id);
  },
  save: async (request: Request, response: Response, next: NextFunction) => {
    return User.save(request.body);
  },
  remove: async (request: Request, response: Response, next: NextFunction) => {
    let userToRemove = await this.userRepository.findOne(request.params.id);
    await User.remove(userToRemove);
  }
};

export default UserController;