import express from "express";

import registerRouter from "./routes/registerRouter.js";
import loginRouter from "./routes/loginRouter.js";
import usersRouter from "./routes/usersRouter.js";

const app = express();
app.use(express.json());

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/users", usersRouter);
const PORT = process.env.PORT ?? 3000;
app.listen(PORT);   