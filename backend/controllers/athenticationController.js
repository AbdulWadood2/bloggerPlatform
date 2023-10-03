import jwt from "jsonwebtoken";
import { promisify } from "util";
import StatusCodes from "http-status-codes";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.jwtsecret, {
    expiresIn: "90d",
  });
};

const applicationProgramInterface = {
  createSendToken: async (user,statusCode, req, res, next) => {
    let token = signToken(user._id);
    user.token = token;
    await user.save();
    // user.token = undefined;

    res.status(statusCode).json({
      success: true,
      token,
      data: {
        user,
      },
    });
  },

  protect: (model) => async (req, res, next) => {
    try {
      const user = await model.find({ token: { $in: [req.headers.jwt] } });
      if (!user.length > 0) {
        res.status(500).json({
          error: "You are not logged in! please login to get access",
        });
      } else {
        let token;
        token = req.headers.jwt;
        const decoded = await promisify(jwt.verify)(
          token,
          process.env.jwtsecret
        );
        const freshUser = await model.findById(decoded.id);
        if (!freshUser) {
          res.status(500).json({
            error: "The user belonging to this token no longer exist!",
          });
        }

        req.user = freshUser;
        next();
      }
    } catch (error) {
      res.status(500).json({
        error,
      });
    }
  },
};
export default applicationProgramInterface;
// BOTH ARE SAME

// exports.abc= (model) => console.log('BC');

// exports.abc= () => {
//   console.log('BC')
// }
