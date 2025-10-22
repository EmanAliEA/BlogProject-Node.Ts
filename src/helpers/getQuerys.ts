// get query param key and value
import { Request } from 'express';

export function getFirstQueryParam(
  req: Request
): { key: string; value: any } | null {
  const options = ['category', 'title', 'content'];
  const key = Object.keys(req.query).find((k) => options.includes(k));
  if (!key) return null;
  return { key, value: req.query[key] };
}
