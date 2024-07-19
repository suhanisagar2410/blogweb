import express from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getAllThePosts,
  getPost,
  getPostsByUser,
  getPostsByCategory,
} from "../controllers/postController.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../src/images/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const postRoute = express.Router();

postRoute.get("/", (req, res) => {
  res.json({
    status: 1,
    message: "Welcome to post route",
  });
});

postRoute.post("/create-post", upload.single("featuredimage"), createPost);
postRoute.patch("/:id", upload.single("featuredimage"), updatePost);
postRoute.delete("/:id", deletePost);
postRoute.get("/all-post", getAllThePosts);
postRoute.get("/:id", getPost);
postRoute.get("/category/:category", getPostsByCategory);
postRoute.get("/user/:userId", getPostsByUser);

export default postRoute;
