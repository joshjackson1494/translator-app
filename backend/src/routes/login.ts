import express from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "../types/api";
import bcrypt from "bcrypt";
import { User } from "../types/schema";
import { database, getDatabase } from "../middleware/mongo";
import { Collections } from "../constants";

const loginRouter = express.Router();

loginRouter.use(database);

const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

loginRouter.post("/", async (_, res) => {
  const result = loginSchema.safeParse(_.body);

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      data: result.error.errors.map((e) => e.message),
    });
    return;
  }

  const { email, password } = result.data;

  try {
    const db = await getDatabase();
    const user = await db
      .collection(Collections.USERS)
      .findOne<User>({ email });

    if (!user || !user.password) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: "invalid username or password",
      });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        status: StatusCodes.UNAUTHORIZED,
        error: "invalid password",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      data: user,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: err instanceof Error ? err.message : "unknown error",
    });
  }
});

export default loginRouter;
