import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import errorHandler from "../utils/error.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.Id);
    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    const { password, ...info } = user._doc;
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  if (req.params.Id !== req.user.id) {
    return next(errorHandler(401, "You can only update your own account!"));
  }
  console.log(req.body);
  try {
    if (req.body.password) {
      req.body.password = await bcryptjs.hash(req.body.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.Id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...info } = user._doc;
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.Id !== req.user.id) {
    return next(errorHandler(401, "You can only delete your own account!"));
  }
  try {
    const isdeleted = await User.findByIdAndDelete(req.params.Id);
    if (!isdeleted) {
      return next(errorHandler(404, "User not found!"));
    }

    res.clearCookie(process.env.COOKIE_KEY);
    return res.status(200).json("User has been deleted...");
  } catch (error) {
    return next(errorHandler(500, error.message));
    console.log(error);
    next(error);
  }
};
