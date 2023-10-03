/* fileSystem */
import fs from "fs";
/* package for status codes */
import { StatusCodes } from "http-status-codes";
/* for password security and hide password in db */
import bcrypt from "bcrypt";
/* controllers */
import authenticationController from "../controllers/athenticationController.js";
/* import models */
import userModel from "../models/userModel.js";
import postModel from "../models/postModel.js";
const applicationProgramInterface = {
  signUpController: async (req, res) => {
    try {
      const { userName, password } = req.body;
      /* make user password secure*/
      const saltRounds = 10;
      const hash = bcrypt.hashSync(password, saltRounds);
      /* make user */
      const newUser = await userModel.create({
        userName,
        password: hash,
      });
      if (newUser) {
        authenticationController.createSendToken(
          newUser,
          StatusCodes.ACCEPTED,
          req,
          res
        );
      }
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error,
      });
    }
  },
  loginController: async (req, res) => {
    try {
      const { userName, password } = req.body;
      const user = await userModel.findOne({ userName });
      if (!user) {
        return res.status(StatusCodes.ACCEPTED).json({
          success: false,
          message: "not user with this Name",
        });
      }
      /* check password validation */
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "password is incorrect",
        });
      }
      if (user) {
        authenticationController.createSendToken(
          user,
          StatusCodes.ACCEPTED,
          req,
          res
        );
      }
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: `${error}`,
      });
    }
  },
  makePostController: async (req, res) => {
    try {
      if (req.post) {
        return res.status(StatusCodes.ACCEPTED).json({
          success: true,
          post: req.post,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: `${error}`,
      });
    }
  },
  deletePostController: async (req, res) => {
    try {
      const { id } = req.body;

      const userOfThisPost = await userModel.findOne({
        token: req.headers.jwt,
      });
      fs.unlink(`./posts/${userOfThisPost.userName}/${id}.jpg`, (err) => {
        if (err) {
          console.log(err);
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            err,
          });
        }
      });
      let post = await postModel.findByIdAndDelete(id).populate("user");
      await post.user.blogs.pull(post);
      await post.user.save();
      return res.status(StatusCodes.ACCEPTED).json({
        success: true,
        Message: "the post is deleted",
      });
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: `${error}`,
      });
    }
  },
  showAllPostsController: async (req, res) => {
    try {
      let allPosts = await postModel.find();
      allPosts = JSON.stringify(allPosts);
      allPosts = JSON.parse(allPosts);
      for (const [index, item] of allPosts.entries()) {
        const user = await userModel.findById(item.user);
        allPosts[index].userName = user.userName;
      }
      return res.status(StatusCodes.ACCEPTED).json({
        success: true,
        allPosts,
      });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error,
      });
    }
  },
  showMyPostsController: async (req, res) => {
    try {
      const { jwt } = req.headers;
      const user = await userModel.findOne({ token: jwt });
      const userBlogsArray = user.blogs;
      const describedUserBlogsArray = [];
      for (let blog of userBlogsArray) {
        const blogIs = await postModel.findById(blog);
        describedUserBlogsArray.push(blogIs);
      }
      return res.status(StatusCodes.ACCEPTED).json({
        success: true,
        user: user.userName,
        describedUserBlogsArray,
      });
    } catch (error) {
      console.log(error);
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error,
      });
    }
  },
};

export default applicationProgramInterface;
