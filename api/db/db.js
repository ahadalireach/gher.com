import mongoose from "mongoose";

const connectDB = async (req, res) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
