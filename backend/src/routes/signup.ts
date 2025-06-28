import express from "express";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { APIResponse } from "../types/api";
import bcrypt from "bcrypt";
import { User } from "../types/schema";
import { database, getDatabase } from "../middleware/mongo";
import { Collections } from "../constants";

const signRouter = express.Router();

signRouter.use(database);

const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[A-Z]/, "Password must contain at least on uppercase letter")
  .regex(/[a-zA-Z0-9]/, "Password must contain at least one special character");

const signupSchema = z.object({
  email: z.string(),
  password: passwordSchema,
});

signRouter.post("/", async (_, res) => {
  const result = signupSchema.safeParse(_.body);
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

    const userExists = await db
      .collection(Collections.USERS)
      .findOne<User>({ email });

    if (userExists) {
      res.status(StatusCodes.CONFLICT).json({
        status: StatusCodes.CONFLICT,
        error: "user already registered",
      } as APIResponse);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = {
      email,
      password: hashedPassword,
    };

    const insert = await db.collection(Collections.USERS).insertOne(user);

    if (!insert.acknowledged) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        error: "Failed to create user",
      } as APIResponse);
      return;
    }

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      data: '"User created successfully!',
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: StatusCodes.INTERNAL_SERVER_ERROR,
      error: err instanceof Error ? err.message : "Unknown error",
    } as APIResponse);
  }
});

export default signRouter;
