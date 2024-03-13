import express from "express";

// CREATE AN EXPRESS APP
const app = express();

// CREATE A ROUTE
app.get("/", (req, res) => {
  res.send("Subscribe to the App.");
});

// LISTEN AT A PORT
app.listen("8000", () => {
  console.log("Server is running... ");
});
