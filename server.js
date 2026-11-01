import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import express from "express";

const app = express();

const PORT = process.env.PORT || 8000;

import cors from "cors";
import morgan from "morgan";
import { dbConnect } from "./src/config/dbConfig.js";

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

//API Endpoints
import authRoute from "./src/routes/authRoute.js";
import { errorHandler } from "./src/middleware/errorHandler.js";
import { responseClient } from "./src/middleware/responseClient.js";

app.use("/api/v1/auth", authRoute);

//Server status
app.get("/", (req, res, next) => {
  const message = "Server is Live";
  responseClient({ req, res, message });
});

app.use(errorHandler);
