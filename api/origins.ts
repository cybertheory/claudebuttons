import { Redis } from '@upstash/redis';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).end();

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(200).json([]);
  }

  const redis = Redis.fromEnv();
  const origins: string[] = await redis.smembers('origins');

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  return res.status(200).json(origins.sort());
}
