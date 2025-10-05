import jwt from "jsonwebtoken";

const adminAuthenticated = (req, res, next) => {
  const token = req.cookies.admin;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default adminAuthenticated;
