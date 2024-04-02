import express from "express";
import authRoutes from "./routes/auth";
import mongoose from "mongoose";
import dotenv from "dotenv";

// CREATE AN EXPRESS APP
const app = express();

dotenv.config();

// CREATE A ROUTE
app.use(express.json());
app.use("/auth", authRoutes);

// MONGOOSE CONNECTION
mongoose
  .connect(process.env.MONGO_URI as string) 
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    throw new Error(err);
  });

// LISTEN FOR REQUESTs
app.listen("8000", () => {
  console.log("Server is running... ");
});
