import express from "express";
import cors from "cors";
import dotenv from "dotenv/config";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();


const allowedOrigins = process.env.CLIENT_URLS
    .split(",")
    .map(origin => origin.trim());

app.use(cors({
    origin: allowedOrigins
}));

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
    return res.json({ "message": "API Working Fine" })
});

app.use("/api/images", imageRoutes);

app.use(errorMiddleware);

export default app;



