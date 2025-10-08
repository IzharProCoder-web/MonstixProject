// import mongoose from "mongoose";


// const connectDb = async () => {
//     await mongoose.connect(process.env.MONGO_URL).then(() => {
//         console.log("Mongodb Is Connected")
//     }).catch((err) => {
//         console.log(err)
//     })
// }

// export default connectDb;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 15000, // Increase timeout to 15s
      maxPoolSize: 10, // Connection pool for serverless
      connectTimeoutMS: 10000, // Connection timeout
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB