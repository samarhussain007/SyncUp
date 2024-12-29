import Redis from "ioredis";
import { redisConfigs } from "../config";

console.log(redisConfigs.redisHost);

const redis = new Redis({
  host: redisConfigs.redisHost,
  port: Number(redisConfigs.redisPort),
});

export default redis;
