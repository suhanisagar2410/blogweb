import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import authRouter from "./router/authRoute.js";
import postRouter from "./router/postRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "./images")));

app.use("/auth", authRouter);
app.use("/post", postRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
