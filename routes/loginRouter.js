import express from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import dotenv from "dotenv"

dotenv.config();

import prisma from "../config/prisma.js";
import validateLogin from "../validator/validateLogin.js";

const loginRouter = express.Router();


loginRouter.post("/", validateLogin, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({
        errors: errors.array(),
    });

    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) return res.status(400).json({
        errors: {
            message: "Wrong email."
        }
    });

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) return res.status(400).json({
        errors: { message: "Wrong password" }
    });
    const { password: _, ...userData } = user;

    const token = jwt.sign(
        { user: userData },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        });
    return res.json({ token, user: userData });
});

export default loginRouter;