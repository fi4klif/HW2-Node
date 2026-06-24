import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError(401, "Authorization token missing or invalid")); // [cite: 79]
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // [cite: 80]

    req.user = decoded; // [cite: 81]
    next(); // [cite: 81]
  } catch (error) {
    next(createHttpError(401, "Invalid or expired token")); //
  }
};
