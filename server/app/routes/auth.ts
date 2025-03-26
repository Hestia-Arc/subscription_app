import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { checkAuth } from "../middlewares/checkAuth";

const router = express.Router();

// -----------------------------------
// CREATE A POST REQUEST FOR SIGNING UP
// ------------------------------------
router.post(
  "/signup",
  body("username")
    .isString()
    .not()
    .isEmpty()
    .withMessage("Username must be a string"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password is invalid, minimum of 8 characters"),
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

    // VERIFY EMAIL IN DB
    const { username, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.json({
        errors: [
          {
            msg: "Email already exists",
          },
        ],
        data: null,
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // SAVE USER TO DB
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // CREATE AND SEND TOKEN
    const token = await JWT.sign(
      { email: newUser.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: 360000,
      }
    );

    // SEND THE TOKEN
    res.json({
      errors: [],
      data: {
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
        },
      },
      msg: "Registration successful",
    });
  }
);

// ----------------------
// POST REQUEST FOR LOGIN
// -----------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({
      errors: [
        {
          msg: "Invalid email",
        },
      ],
      data: null,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.json({
      errors: [
        {
          msg: "Invalid credentials",
        },
      ],
      data: null,
    });
  }

  // CREATE  TOKEN
  const token = await JWT.sign(
    { email: user.email },
    process.env.JWT_SECRET as string,
    {
      expiresIn: 360000,
    }
  );

  // SEND THE TOKEN
  res.json({
    errors: [],
    data: {
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    },
    msg: "login successful",
  });
});

// ----------------------
// GET REQUEST FOR USER DATA
// -----------------------
router.get("/user", checkAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user });

  return res.json({
    errors: [],
    data: {
      user: {
        id: user?._id,
        email: user?.email,
        username: user?.username,
      },
    },
  });
});

export default router;
