import mongoose from "mongoose";
import express from "express";

const app = express();

;(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App is Listining on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
})();
