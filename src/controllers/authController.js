import bcrypt from "bcrypt";
import db from "./database.js";
import jwt from "jsonwebtoken";

export const signup = (req, res) => {
  const { email, password, name } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Error checking for existing user:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("Error hashing password:", hashErr);
        return res.status(500).json({ message: "Internal server error" });
      }

      db.query(
        "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
        [email, hashedPassword, name],
        (insertErr) => {
          if (insertErr) {
            console.error("Error inserting new user:", insertErr);
            return res.status(500).json({ message: "Internal server error" });
          }

          res.status(201).json({ message: "User created successfully" });
        }
      );
    });
  });
};
export const login = (req, res) => {
  const { email, password } = req.body;
  console.log(email,password);

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      console.error("Error checking for user:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const user = results[0];

    if (!user) {
      return res.status(404).json({ message: "Email address does not exist" });
    }

    bcrypt.compare(password, user.password, (bcryptErr, passwordMatch) => {
      if (bcryptErr) {
        console.error("Error comparing passwords:", bcryptErr);
        return res.status(500).json({ message: "Internal server error" });
      }

      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user.id }, "your_secret_key", {
        expiresIn: "1h",
      });

      res.status(200).json({ token, message: "Logged in successfully" });
    });
  });
};



export const getCurrentUser = (req, res) => {
  console.log(req);
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Missing authorization header" });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(token, "your_secret_key", (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    } else {
      const userId = decodedToken.userId;

      db.query("SELECT * FROM users WHERE id = ?", [userId], (err, results) => {
        if (err) {
          console.error("Error retrieving user information:", err);
          return res.status(500).json({ message: "Internal server error" });
        } else {
          const user = results[0];
          res.status(200).json({ user });
        }
      });
    }
  });
};
export const logout = (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Internal server error" });
      }

      res.clearCookie('sessionId'); // Clear session cookie if any
      res.status(200).json({ message: 'Logout successful' });
    });
  } else {
    res.status(200).json({ message: 'Logout successful' });
  }
};
