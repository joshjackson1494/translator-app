import express from "express";
import signRouter from "./signup";
import loginRouter from "./login";

const routes = express.Router();

routes.use("/signup", signRouter);
routes.use("/login", loginRouter);

export default routes;
