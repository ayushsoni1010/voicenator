import express from "express";
import errorHandler from "./middlewares/error.middlewares";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Error handling middleware
app.use(errorHandler);

// Serve static files from public directory
const staticPath = path.resolve("public/");
app.use(express.static(staticPath));

// CORS configuration
app.use(cors({ credentials: false, origin: "*" }));

// Example route for testing
app.get("/api/health", (req, res) => {
  res.send({ status: "OK" });
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Fallback route to serve index.html for all other requests
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }
  res.sendFile(path.join(staticPath, "index.html"));
});

export default app;
