
import jwt from "jsonwebtoken";

const checkTokenMiddleware = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.status(401).json({ message: "Token is required" });
    }
    const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET_KEY);
    
    req.userId=decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



export  default checkTokenMiddleware ;