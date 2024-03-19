import express from "express";
import authRoutes from "./routes/auth"

// CREATE AN EXPRESS APP
const app = express();

// CREATE A ROUTE
app.use(express.json())
app.use("/auth", authRoutes);

// LISTEN FOR REQUESTs
app.listen("8000", () => {
  console.log("Server is running... ");
});
