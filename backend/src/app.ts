import express from "express";
import routes from "./routes";
import configureMiddleware from "./middleware";
import { PORT } from "./constants";

const app = express();

configureMiddleware(app);

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
