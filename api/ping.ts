import { Redis } from '@upstash/redis';

const ORIGIN_RE = /^https?:\/\/[a-z0-9]([a-z0-9\-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]*[a-z0-9])?)*(:\d{1,5})?$/i;
const MAX_LEN = 256;

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).end(); }
  }

  const origin = body?.origin;
  if (typeof origin !== 'string' || origin.length > MAX_LEN || !ORIGIN_RE.test(origin)) {
    return res.status(400).end();
  }

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(204).end();
  }

  const redis = Redis.fromEnv();
  await redis.sadd('origins', origin);
  return res.status(204).end();
}
