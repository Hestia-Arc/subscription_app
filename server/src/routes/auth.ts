import express from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

// CREATE A POST REQUEST FOR SIGNING UP
router.post(
  "/signup",
  body("username").isString().not().isEmpty().withMessage("Username must be a string"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password").isLength({ min: 8 }).withMessage("Password is invalid, minimum of 8 characters"),
  async (req, res) => {
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map((error) => {
        return {
          msg: error.msg,
        };
      });

      return res.status(400).json({ errors });
    }

    // IF NO ERROR,SEND THIS RESPONSE
    res.json({
      msg: "valid credentials",
    });
  }
);

export default router;
