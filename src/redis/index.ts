import Redis from "ioredis";
import { redisConfigs } from "../config";
import { RedisPubSub } from "graphql-redis-subscriptions";

console.log(redisConfigs.redisHost);

const redis = new Redis({
  host: redisConfigs.redisHost,
  port: Number(redisConfigs.redisPort),
});

export const pubsub = new RedisPubSub({
  publisher: new Redis(Number(redisConfigs.redisPort), redisConfigs.redisHost), // Dedicated publisher client
  subscriber: new Redis(Number(redisConfigs.redisPort), redisConfigs.redisHost),
});

export default redis;
