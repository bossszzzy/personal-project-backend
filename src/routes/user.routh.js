import express from "express";
import * as userController from "../controllers/user.controller.js"

const userRoute = express.Router();

userRoute.get('/',userController.getCategory)
userRoute.get('/:id',()=>{})

export default userRoute