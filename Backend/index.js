import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import adminRouter from "./routes/adminRouter.js";

const app = express();

const PORT = process.env.PORT;

await connectDb()

//middileware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: " http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("Api Is Working ");
});

app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      success: false, 
      message: "Database not connected. Please try again." 
    });
  }
  next();
});

app.listen(PORT, (req, res) => {
  console.log(`The Server Is Running on ${PORT} `);
});
