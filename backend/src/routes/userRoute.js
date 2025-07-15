import express from "express";
import authUser from "../middlewares/userAuth.js";
import {
  deleteLoveHistory,
  getLoveHistory,
  getUserData,
  saveLoveCalculation,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/user-data", authUser, getUserData);
userRouter.post("/calculate", saveLoveCalculation);
userRouter.get("/inbox", authUser, getLoveHistory);
userRouter.delete("/inbox/:id", authUser, deleteLoveHistory);

export default userRouter;
