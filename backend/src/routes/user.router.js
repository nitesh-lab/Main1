import express, { Router } from "express";
import { CheckUser, Login, RefreshAcessToken, Signup, getAllUsers, getUser } from "../controllers/users.controller.js";
import { upload } from "../middlewares/upload.js";
import verifyJWT from "../middlewares/Verifyjwt.js";


export const Userrouter=Router();

Userrouter.route("/").get(getAllUsers);

Userrouter.route("/signup").post(upload.single("avatar"),Signup);

Userrouter.route("/login").post(Login);

Userrouter.route("/refresh").get(RefreshAcessToken);

Userrouter.route("/CheckUser").get(verifyJWT,CheckUser);

Userrouter.route("/getUser").get(verifyJWT,getUser);