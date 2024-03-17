import Listing from "../models/listing.model.js";
import errorHandler from "../utils/error.js";

export const postListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getMyListings = async (req, res, next) => {
  try {
    console.log(req.user);
    const listings = await Listing.find({ userRef: req.user.id });

    if (!listings || listings.length < 1)
      return next(errorHandler(404, "Listings not found"));

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

export const getListingsById = async (req, res, next) => {
  try {
    console.log(req.params.Id);
    const listing = await Listing.findById(req.params.Id);

    if (!listing) return next(errorHandler(404, "Listing not found"));

    return res.status(200).json(listing);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const updateListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.Id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (listing.userRef !== req.user.id) {
      return next(errorHandler(401, "You can only update your own listing!"));
    }

    const isUpdatedlisting = await Listing.findByIdAndUpdate(
      req.params.Id,
      { $set: req.body },

      { new: true }
    );

    if (!isUpdatedlisting) {
      return next(errorHandler(404, "Listing not found!"));
    }

    return res.status(200).json(isUpdatedlisting);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.Id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (listing.userRef !== req.user.id) {
      return next(errorHandler(401, "You can only delete your own listing!"));
    }

    const isdeleted = await Listing.findByIdAndDelete(req.params.Id);
    if (!isdeleted) {
      return next(errorHandler(404, "Listing not found!"));
    }
    return res.status(200).json("Listing has been deleted...");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const searcListings = async (req, res, next) => {
  try {
    console.log(req.query);
    const limit = parseInt(req.query.limit) || 6;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [true, false] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";
    console.log(sort);
    console.log(order);
    const total = await Listing.countDocuments({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
    const mylistings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    if (!mylistings || mylistings.length < 1) {
      return next(errorHandler(404, "Listings not found"));
    }

    return res.status(200).json({ listings: mylistings, total });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
