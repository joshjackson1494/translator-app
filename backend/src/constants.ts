export const PORT = process.env.PORT ?? 8080;

export const MONGODB_URI =
  process.env.MONGODB_URI ?? "mongodb://localhost:27017/yourdatabase";

export enum Collections {
  USERS = "users",
}
