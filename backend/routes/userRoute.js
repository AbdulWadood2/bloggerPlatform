import express from "express";
/* make router */
const ROUTE = express.Router();
/* import controllers */
import controller from "../controllers/userController.js";
import athenticationController from "../controllers/athenticationController.js";
/* models */
import userModel from "../models/userModel.js";
import postModel from "../models/postModel.js";
/* mongoose */
import mongoose from "mongoose";
/* multer for images */
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* fs */
import fs from "fs";
// Define the storage engine and file naming function
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // Define the destination folder dynamically based on your logic
      const destinationFolder = await determineDestinationFolder(req, file);

      // Create the folder if it doesn't exist
      const uploadPath = path.join(__dirname, "../posts", destinationFolder);
      fs.mkdirSync(uploadPath, { recursive: true });

      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: async (req, file, cb) => {
    try {
      // Define the file name dynamically based on your logic
      const fileName = await determineFileName(req, file);

      cb(null, fileName);
    } catch (err) {
      cb(err);
    }
  },
});

const upload = multer({ storage });
// Define your custom logic to determine the destination folder
async function determineDestinationFolder(req, file) {
  try {
    const user = await userModel.findOne({ token: req.headers.jwt });
    // Implement your logic here to determine the folder
    // where you want to store the file based on req or file properties.
    return `${user.userName}`; // Default folder if logic doesn't match
  } catch (error) {
    throw new Error(error);
    // console.log(error);
    // return res.status(StatusCodes.BAD_REQUEST).json({
    //   success: false,
    //   error,
    // });
  }
}

// Define your custom logic to determine the file name
async function determineFileName(req, file) {
  try {
    let { title, photoLocation, description } = req.body;
    /* createPost */
    let post = await postModel.create({
      title,
      photoLocation: "",
      description,
    });
    /* find user */
    const user = await userModel.findOne({ token: req.headers.jwt });
    const fileLocation = `./posts/${user.userName}/${post.id}.jpg`;
    post.photoLocation = fileLocation;
    await post.save();
    /* createSession */
    const session = await mongoose.startSession();
    session.startTransaction();
    await post.save({ session });
    user.blogs.push(post);
    post.user = user;
    await user.save({ session });
    await session.commitTransaction();
    post = await post.save();
    const fileName = `${post._id}.jpg`;
    req.post = post;
    // Implement your logic here to determine the file name.
    // You can use file.originalname or other properties of the file object.
    return fileName; // Use the original file name as an example
  } catch (error) {
    throw Error(error);
    // console.log(error);
  }
}
/* route is coded in controllers folder */
ROUTE.route("/signUp").post(controller.signUpController);
ROUTE.route("/login").post(controller.loginController);
ROUTE.route("/makePost").post(
  athenticationController.protect(userModel),
  (req, res, next) => {
    // Custom middleware to handle multer errors
    upload.single("photoLocation")(req, res, (err) => {
      if (err) {
        // Handle multer-related errors here
        return res
          .status(400)
          .json({ error: "File upload failed", message: err.message });
      }
      // If there are no multer-related errors, call the next middleware
      next();
    });
  },
  controller.makePostController
);
ROUTE.route("/deletePost").post(
  athenticationController.protect(userModel),
  controller.deletePostController
);
ROUTE.route("/showAllPosts").post(
  athenticationController.protect(userModel),
  controller.showAllPostsController
);
ROUTE.route("/showMyPosts").post(
  athenticationController.protect(userModel),
  controller.showMyPostsController
);

export default ROUTE;
