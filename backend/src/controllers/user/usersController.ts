import { Response, Request } from "express";
import { User } from "../../models/User";
import { IGetUserAuthInfoRequest } from "../../middleware/verifyJWT";
import getErrorMessage from "../../helpers/getErrorMessage";
import { RequestWithVerifiedUser } from "../../types";
require("dotenv").config();

const usersController = {
  //just for development purposes, delete it or remove later
  getUsers: async (req: IGetUserAuthInfoRequest, res: Response) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },

  getUser: async (req: Request, res: Response) => {
    const username = req.params.username;
    try {
      const user = await User.findOne({ username });
      const { password, refreshToken, _id, ...userWithoutPassword } =
        JSON.parse(JSON.stringify(user));
      res.json(userWithoutPassword);
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },

  editUser: async (req: Request, res: Response) => {
    const request = req as RequestWithVerifiedUser;
    try {
      const userToUpdate = req.body;
      const user = await User.findOneAndUpdate(
        { _id: request.user._id },
        { ...userToUpdate },
        { returnNewDocument: true },
      );
      const { password, refreshToken, _id, ...userWithoutPassword } =
        JSON.parse(JSON.stringify(user));
      res.json(userWithoutPassword);
    } catch (error) {
      console.log(getErrorMessage(error));
      res.status(500).json({ error: getErrorMessage(error) });
    }
  },
};

export default usersController;
