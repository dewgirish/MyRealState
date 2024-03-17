import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import errorHandler from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    const { password: userPassword, ...userInfo } = newUser._doc;
    res.status(201).json(userInfo);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "Invalid username/password"));
    }

    const isPasswordValid = bcryptjs.compareSync(password, user.password);

    if (!isPasswordValid) {
      return next(errorHandler(404, "Invalid username/password"));
    }

    const { password: userPassword, ...userInfo } = user._doc;

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res
      .cookie(process.env.COOKIE_KEY, token, { httpOnly: true })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { name, email, photo } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const { pass: password, ...rest } = user._doc;

      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res
        .cookie(process.env.COOKIE_KEY, token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const formattedUserName =
        name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);

      const newUser = new User({
        username: formattedUserName,
        email,
        password: hashedPassword,
        avatar: photo,
      });
      await newUser.save();
      const { password, ...userInfo } = newUser._doc;
      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res
        .cookie(process.env.COOKIE_KEY, token, { httpOnly: true })
        .status(201)
        .json(userInfo);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie(process.env.COOKIE_KEY)
      .status(200)
      .json({ message: "Signout successful" });
  } catch (error) {
    next(error);
  }
};
