import { config } from "dotenv";
config();

console.log(process.env.REDIS_HOST);
export const redisConfigs = {
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: process.env.REDIS_PORT || 6379,
};
