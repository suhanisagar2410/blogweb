import express from 'express';
import {signup,login,getCurrentUser,logout} from '../controllers/authController.js';


const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/current-user', getCurrentUser);
authRouter.post('/logout', logout);

authRouter.get("/", (req, res) => {
    res.json({
      status: 1,
      message: "welcome to Auth route",
    });
  });

export default authRouter;
