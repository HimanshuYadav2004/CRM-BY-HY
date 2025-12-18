import jwt from "jsonwebtoken";
import User from "../models/User";

const authMiddleware = async (req, res, next) => {
  try {
    //step 1 is reading the authization header

    const authHeader = req.headers.authorization;

    //it expects a format of Bearer <TOKEN>
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({
        message: "Not Authorized, Token is Missing",
      });
    }

    // split header from bearer in auth header
    const token = authHeader.split(" ")[1];

    // step 2 is verify the token recieved header's token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //decoded have userId , userroles, iat

    //3 - find user from DB

    const user = User.findById(decoded.userId);

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: "User not authorized",
      });
    }

    req.user = user;

    next();
  } catch (error) {
      return res.status(401).json({
          message: 'Invalid or expired token'
      });
  }
};

export default authMiddleware;