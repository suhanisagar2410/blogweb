import db from "./database.js";
// import { Buffer } from "buffer";
import fs from "fs";
// import path from "path";
// import moduleName from '../../src/images'

// import { fileURLToPath } from "url";
export const createPost = async (req, res) => {
  const { title, slug, content, category, status, userId } = req.body;
  const featuredimage = req.file;
  console.log(featuredimage);

  if (!featuredimage) {
    return res.status(400).json({ message: "Featured image is required" });
  }

  try {
    const filename = featuredimage.filename;

    // db.query(
    //   `INSERT INTO images (filename, created) VALUES (?, NOW())`,
    //   [filename],
    //   (err, results) => {
    //     if (err) {
    //       console.error("Error inserting image:", err);
    //       return res.status(500).json({ message: "Internal server error" });
    //     }

    //     const imageId = results.insertId;

    db.query(
      `INSERT INTO articles (title, slug, content, featuredimage, category, status, userId)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, slug, content, filename, category, status, userId],
      (err, results) => {
        if (err) {
          console.error("Error creating post:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        res.status(201).json({
          message: "Post created successfully",
          postId: results.insertId,
        });
      }
    );
    //   }
    // );
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updatePost = (req, res) => {
  const { id } = req.params;
  const { title, content, category, status, slug } = req.body;
  const featuredImage = req.file;
  console.log("featuredImage:", featuredImage);
  console.log("Hellowwwwwwwwwwww");

  if (featuredImage) {
    const filename = featuredImage.filename;

    db.query(
      `SELECT featuredimage FROM articles WHERE id=?`,
      [id],
      (err, results) => {
        if (err) {
          console.error("Error retrieving previous featured image:", err);
          return res.status(500).json({ message: "Internal server error" });
        }

        if (results[0].featuredimage) {
          const previousFilename = results[0].featuredimage;
          fs.unlink(
            `C:/Training/Full-Stack/11blogweb/src/images/${previousFilename}`,
            (err) => {
              if (err) {
                console.error("Error deleting previous image file:", err);
                return res
                  .status(500)
                  .json({ message: "Internal server error" });
              }
              console.log("Previous image deleted successfully");
            }
          );
        }

        db.query(
          `UPDATE articles SET title=?, content=?, featuredimage=?, category=?, status=?, slug=? WHERE id=?`,
          [title, content, filename, category, status, slug, id],
          (err) => {
            if (err) {
              console.error("Error updating post:", err);
              return res.status(500).json({ message: "Internal server error" });
            }
            res
              .status(200)
              .json({ message: "Post and image updated successfully" });
          }
        );
      }
    );
  } else {
    db.query(
      `UPDATE articles SET title=?, content=?, category=?, status=?, slug=? WHERE id=?`,
      [title, content, category, status, slug, id],
      (err) => {
        if (err) {
          console.error("Error updating post:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        res.status(200).json({ message: "Post updated successfully" });
      }
    );
  }
};

export const deletePost = (req, res) => {
  const { id } = req.params;
  db.query(
    `SELECT featuredimage FROM articles WHERE id=?`,
    [id],
    (err, results) => {
      if (err) {
        console.error("Error retrieving featured image ID:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "Post not found" });
      }

      const featuredImageName = results[0].featuredimage;

      db.query(`DELETE FROM articles WHERE id=?`, [id], (err) => {
        if (err) {
          console.error("Error deleting post:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        if (featuredImageName) {
          // Delete the image file from the server
          fs.unlink(
            `C:/Training/Full-Stack/11blogweb/src/images/${featuredImageName}`,
            (err) => {
              if (err) {
                console.error("Error deleting image file:", err);
                return res
                  .status(500)
                  .json({ message: "Internal server error" });
              }
              res.status(200).json({
                message: "Post and featured image deleted successfully",
              });
            }
          );
        } else {
          res.status(200).json({
            message: "Post deleted successfully, no featured image to delete",
          });
        }
      });
    }
  );
};

export const getPost = (req, res) => {
  const { id } = req.params;

  db.query(`SELECT * FROM articles WHERE id=?`, [id], (err, results) => {
    if (err) {
      console.error("Error retrieving post:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    const post = results[0];
    // console.log("Post data:",post);

    if (post.featuredimage) {
      const imagePath = post.featuredimage
        ? `http://localhost:3000/images/${post.featuredimage}`
        : null;
      // console.log(imagePath);
      post.imagePath = imagePath;
    } else {
      post.imagePath = null;
    }

    res.status(200).json({ post });
  });
};

export const getPostsByCategory = (req, res) => {
  const { category } = req.params;
  const { page = 1, limit = 8 } = req.query;
  const offset = (page - 1) * limit;

  db.query(
    `SELECT * FROM articles WHERE category=? LIMIT ? OFFSET ?`,
    [category, parseInt(limit), parseInt(offset)],
    (err, results) => {
      if (err) {
        console.error("Error retrieving posts:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const postsWithImages = results.map((post) => {
        if (post.featuredimage) {
          const imagePath = post.featuredimage
            ? `http://localhost:3000/images/${post.featuredimage}`
            : null;
          return { ...post, imagePath };
        } else {
          return { ...post, imagePath: null };
        }
      });

      res.status(200).json({ posts: postsWithImages });
    }
  );
};

export const getAllThePosts = (req, res) => {
  const { page = 1, limit = 8 } = req.query;
  const offset = (page - 1) * limit;

  db.query(
    `SELECT * FROM articles LIMIT ? OFFSET ?`,
    [parseInt(limit), parseInt(offset)],
    (err, results) => {
      if (err) {
        console.error("Error retrieving posts:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      const postsWithImages = results.map((post) => {
        const imagePath = post.featuredimage
          ? `http://localhost:3000/images/${post.featuredimage}`
          : null;
        return { ...post, imagePath };
      });

      res.status(200).json({ posts: postsWithImages });
    }
  );
};

export const getPostsByUser = (req, res) => {
  const { userId } = req.params;

  db.query(
    `SELECT * FROM articles WHERE userId=?`,
    [userId],
    (err, results) => {
      if (err) {
        console.error("Error retrieving posts:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No active posts found for this user" });
      }

      const postsWithImages = results.map((post) => {
        if (post.featuredimage) {
          const imagePath = post.featuredimage
            ? `http://localhost:3000/images/${post.featuredimage}`
            : null;
          return { ...post, imagePath };
        } else {
          return { ...post, imagePath: null };
        }
      });

      res.status(200).json({ posts: postsWithImages });
    }
  );
};
// export const uploadFile = async (req, res) => {
//   const file = req.file;
//   console.log("File here--->>", file);
//   if (!file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }
//   const { originalname: filename, buffer } = file;

//   try {
//     db.query(
//       `INSERT INTO images (filename, created) VALUES (?, NOW())`,
//       [filename, buffer],
//       (err, results) => {
//         if (err) {
//           console.error("Error saving image metadata:", err);
//           return res.status(500).json({ message: "Internal server error" });
//         }
//         const imageId = results.insertId;
//         res.status(200).json({ message: "Image uploaded and saved successfully", imageId });
//       }
//     );
//   } catch (error) {
//     console.error("Error uploading image:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// export const deleteFile = async (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     return res.status(400).json({ message: "Invalid image ID" });
//   }

//   try {
//     db.query(
//       "UPDATE articles SET featuredimage = ? WHERE featuredimage = ?",
//       [id],
//       (updateErr) => {
//         if (updateErr) {
//           console.error("Error updating article:", updateErr);
//           return res.status(500).json({ message: "Internal server error" });
//         }

//         db.query("DELETE FROM images WHERE id = ?", [id], (deleteErr) => {
//           if (deleteErr) {
//             console.error("Error deleting image:", deleteErr);
//             return res.status(500).json({ message: "Internal server error" });
//           }
//           res.status(200).json({ message: "Image deleted successfully" });
//         });
//       }
//     );
//   } catch (error) {
//     console.error("Error deleting image:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const getFilePreview = async (req, res) => {
//   const { id } = req.params;
//   db.query(`SELECT featuredimage FROM articles WHERE id = ?`, [id], (err, result) => {
//     if (err) {
//       console.error("Error retrieving featured image:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     if (result.length === 0) {
//       return res.status(404).json({ error: "Featured image not found" });
//     }

//     const featuredimage = result[0].featuredimage;
//     const imagePath = `C:/Training/Full-Stack/11blogweb/src/images/${featuredimage}`;

//     fs.readFile(imagePath, (err, data) => {
//       if (err) {
//         console.error("Error reading image file:", err);
//         return res.status(500).json({ error: "Internal server error" });
//       }

//       const base64String = Buffer.from(data).toString("base64");
//       res.status(200).json({ success: true, data: { base64String } });
//     });
//   });
// };
