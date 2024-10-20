import express from "express";
import registerRouter from "./routes/registerRouter.js";
import loginRouter from "./routes/loginRouter.js";

const app = express();
app.use(express.json());

app.use("/register", registerRouter);
app.use("/login", loginRouter);
const PORT = process.env.PORT ?? 3000;
app.listen(PORT);   