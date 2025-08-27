import express from "express";
import signRouter from "./signup";
import loginRouter from "./login";
import translateRouter from "./translate";

const routes = express.Router();

routes.use("/signup", signRouter);
routes.use("/login", loginRouter);
routes.use("/text", translateRouter);

export default routes;
