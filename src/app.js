import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";
import expressListEndpoints from "express-list-endpoints";

const __dirname = dirname(dirname(fileURLToPath(import.meta.url)));

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/pages"));

// app.use(fileUpload());

// Importing Routes
import {
  brandRouter,
  collectionRouter,
  orderRouter,
  productRouter,
  profileRouter,
  userRouter,
} from "./routes/index.js";

// Using Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/profiles", profileRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/collections", collectionRouter);
app.use("/api/v1/brands", brandRouter);

// Define your routes here
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.render("index", { endpoints });
});

app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: "Page not found",
  });
});

// Error Handler imports
import { errorHandler } from "./middlewares/error.middleware.js";

// Error Handler Middlewares
app.use(errorHandler);

export { app };
