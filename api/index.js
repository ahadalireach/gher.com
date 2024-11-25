import express from "express";
import colors from "colors";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/db.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
dotenv.config();

const PORT = process.env.PORT || 4000;
connectDB();

const app = express();

const corsOptions = {
  origin: ["https://gher.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/properties", propertyRoutes);
app.use("/admin", adminRouter);

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
