import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
dotenv.config();
import connectDB from "./src/config/connectDB.js";
import userRouter from "./src/routes/user.route.js";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = 8000 || process.env.PORT;

app.get("/", (req, res) => {
  // server to client side
  res.json({
    message: "Server is running",
  });
});

app.use("/api/user", userRouter)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
});
