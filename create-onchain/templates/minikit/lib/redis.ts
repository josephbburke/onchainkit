import { Redis } from "@upstash/redis";

if (!process.env.REDIS_URL) {
  throw new Error('REDIS_URL is not defined')
}

if (!process.env.REDIS_TOKEN) {
  throw new Error('REDIS_TOKEN is not defined')
}

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN
})
