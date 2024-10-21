import express from "express";
import bcrypt from "bcryptjs";

import prisma from "../config/prisma.js";
import validateRegister from "../validator/validateRegister.js";
import { validationResult } from "express-validator";
import authenticate from "../middleware/authenticate.js";
import canPut from "../middleware/canPut.js";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });
        return res.json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error. Try later."
        });
    }
});

usersRouter.put("/:id", authenticate, canPut, validateRegister, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    const { name, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.update({
            where: {
                id: Number(req.params.id)
            },
            data: { name, email, password: hashedPassword, role },
            select: {
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return res.json({ message: "Update successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error, try later." })
    }
});

export default usersRouter;