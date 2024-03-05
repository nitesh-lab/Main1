import { Router } from "express";
import AdminLogin from "../controllers/Admin.controller.js";

export const Adminrouter=Router();

Adminrouter.route("/").post(AdminLogin);