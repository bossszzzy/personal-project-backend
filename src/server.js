import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import playSessionRoute from "./routes/playsession.route.js";
import categoryRoute from "./routes/category.route.js";
import gmRoute from "./routes/gm.route.js";
import cors from "cors"

const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}))
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use("/api/auth", authRoute);

app.use("/api/categories", categoryRoute);

app.use("/api/playsession", playSessionRoute);

app.use("/api/gm", gmRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
