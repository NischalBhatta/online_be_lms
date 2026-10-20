import express from "express";

const router = express.Router();

//User Signup

router.post("/register", (req, res, next) => {
  try {
    //to do signup process

    res.json({
      status: "success",
      message: "TODO Signup",
    });
  } catch (error) {
    console.log(error);
  }
});

export default router;
