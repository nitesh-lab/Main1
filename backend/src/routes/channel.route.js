import { Router } from "express";
import verifyJWT from "../middlewares/Verifyjwt.js";
import { CreateChannel, GetAllUsers, getAllChannel, getSingleChannel, joinChannel, leaveroom } from "../controllers/Channel.controller.js";
import { upload } from "../middlewares/upload.js";

export const ChannelRouter=Router();

ChannelRouter.route("/").get(verifyJWT,getAllChannel); //verify daaldena

ChannelRouter.route("/createChannel").post(verifyJWT,upload.single("file"),CreateChannel);

ChannelRouter.route("/getSingleChannel").post(verifyJWT,getSingleChannel); //verifyJWT

ChannelRouter.route("/joinChannel").post(verifyJWT,joinChannel);

ChannelRouter.route("/leaveroom").post(verifyJWT,leaveroom);

ChannelRouter.route("/GetAllUsers").post(verifyJWT,GetAllUsers);