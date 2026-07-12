import app from "./app.js";
import "dotenv/config";
import { logger } from "./utils/logger.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
  logger.info(`Server running on port ${PORT}`);
});
