import express from "express";
import bcrypt from "bcryptjs";

import prisma from "../config/prisma.js";
import validateRegister from "../validator/validateRegister.js";
import { validationResult } from "express-validator";

const registerRouter = express.Router();

registerRouter.post("/", validateRegister, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({
        errors: errors.array(),
    })

    try {
        const { name, email, password, role } = req.body;
        const userExisting = await prisma.user.findUnique({
            where: { email }
        });

        if (userExisting) return res.status(400).json({
            message: "Email already taken."
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, password: hashedPassword, role }
        })

        return res.status(201).json({
            email, name, role: newUser.role
        });
    } catch (error) {
        res.status(500).json(
            { message: "Server error. Try later." }
        );
    }
});

export default registerRouter;