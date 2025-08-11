import express from "express";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import playSessionRoute from "./routes/playsession.route.js";
import categoryRoute from "./routes/category.route.js";
import gmRoute from "./routes/gm.route.js";
import cors from "cors"
import morgan from "morgan";
import errorMiddleware from "./utils/error.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173"
}))
dotenv.config();
app.use(express.json());
app.use(morgan("dev"))

const PORT = process.env.PORT || 8000;

app.use("/api/auth", authRoute);

app.use("/api/categories", categoryRoute);

app.use("/api/playsession", playSessionRoute);

app.use("/api/gm", gmRoute);

app.use((req,res)=>{res.status(404).json({message:"Not found"})})

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
