import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { createError } from "../error.js";

dotenv.config();

export const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return next(createError(401, "You are not authenticated"));
        }

        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return next(createError(401, "You are not authenticated"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();     
    } catch (error) {
        next(err);
    }
};