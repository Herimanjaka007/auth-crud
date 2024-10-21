import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

const authenticate = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer")) {
        return res.status(401).json({ message: "Token not provided." });
    }

    const [_, token] = authorization.split(" ");
    try {
        const tokenMatch = jwt.verify(token, process.env.JWT_SECRET);
        req.user = tokenMatch.user;
        next();
    } catch (error) {
        res.status(500).json(error);
    }
}

export default authenticate;