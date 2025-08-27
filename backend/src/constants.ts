import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT ?? 8080;

export const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/yourdatabase";

export enum Collections {
  USERS = "users",
}

const API_KEY = process.env.API_KEY;

if (API_KEY == null) {
  throw new Error("API_KEY is not set in the environment variables.");
}

export const TRANSLATE_API = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
