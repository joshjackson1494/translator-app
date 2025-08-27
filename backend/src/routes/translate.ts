import { TRANSLATE_API } from "$/constants";
import { APIResponse } from "$/types/api";
import express from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const translateRouter = express.Router();

const textSchema = z.object({
  text: z.string(),
  target: z.string(),
});

translateRouter.post("/", async (req, res) => {
  const result = textSchema.safeParse(req.body);

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      data: result.error.errors.map((e) => e.message),
    });
    return;
  }

  const { text, target } = result.data;

  const response = await fetch(TRANSLATE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      q: text,
      target: target,
    }),
  });

  const translated = await response.text();
  const data = text ? JSON.parse(translated) : {};

  if (data.errors) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: StatusCodes.BAD_REQUEST,
      error: data.message,
    } as APIResponse);
    return;
  }

  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    data: data.data?.translations?.[0]?.translatedText,
  });
});

export default translateRouter;
