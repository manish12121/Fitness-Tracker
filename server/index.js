import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/User.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
    res.status(200).json({ message:"Fitness Tracker Server is running" });
});

app.use("/api/user", router);

app.use((err,req,res,next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
    });
});

const connectDB = async () => {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGODB_URL)
    .then((res) => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
};

const startServer = async () => {
  try {
    app.listen(8080, () => {
      console.log("Server is running on port 8080");
        connectDB();
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();