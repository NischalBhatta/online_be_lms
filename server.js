import express from "express";

const app = express();

const PORT = process.env.PORT || 8000;

import cors from "cors";
import morgan from "morgan";
import { dbConnect } from "./config/dbConfig.js";

//DB Connection
dbConnect()
  .then(() => {
    app.listen(PORT, (error) => {
      error
        ? console.log(error)
        : console.log("Server is running at http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//Server status
app.get("/", (req, res, next) => {
  res.json({
    message: "Server is Live",
  });
});
