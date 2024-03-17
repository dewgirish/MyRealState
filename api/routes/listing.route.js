import express from "express";
import {
  postListing,
  getMyListings,
  getListingsById,
  deleteListingById,
  updateListingById,
  searcListings,
} from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const listingRouter = express.Router();

listingRouter.get("/get", verifyToken, getMyListings);
listingRouter.get("/get/:Id", getListingsById);
listingRouter.post("/create", verifyToken, postListing);
listingRouter.put("/update/:Id", verifyToken, updateListingById);
listingRouter.delete("/delete/:Id", verifyToken, deleteListingById);
listingRouter.get("/find", searcListings);

export default listingRouter;
