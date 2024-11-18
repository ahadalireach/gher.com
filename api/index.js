import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import authRouter from "./routes/authRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.rainbow.italic.underline);
});
