import express from "express";
import {
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/get/:Id",verifyToken, getUser);
router.put("/update/:Id", verifyToken, updateUser);
router.delete("/delete/:Id", verifyToken, deleteUser);

export default router;
