import express from "express";
import "dotenv/config";
import connectDb from "./config/db.js";
import userRouter from "./routes/userRouter.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import adminRouter from "./routes/adminRouter.js";

const app = express();

const PORT = process.env.PORT;

//middileware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "https://monstix-project-frontend.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
//routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("Api Is Working ");
});

app.listen(PORT, (req, res) => {
  console.log(`The Server Is Running on ${PORT} `);
  connectDb();
});
