import dotenv from "dotenv";
import { httpServer } from "./app.js";
import logger from "./logger/winston.logger.js";
import  connectDB  from "./db/index.js";

dotenv.config();

const startServer = () => {
    httpServer.listen(process.env.PORT || 8080, () => {
      logger.info(
        `📑 Visit the documentation at: http://localhost:${
          process.env.PORT || 8080
        }`
      );
      logger.info("⚙️  Server is running on port: " + process.env.PORT);
    });
  };

  if(true) {
    try {
        await connectDB();
        startServer();
      } catch (err) {
        logger.error("Mongo db connect error: ", err);
      }
}