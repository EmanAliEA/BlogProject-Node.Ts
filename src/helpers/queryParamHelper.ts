// Helper to get query param key and value
import { Request } from 'express';

export const getQueryParam = (req: Request) => {
  const options = ['category', 'title', 'content'];
  const key = Object.keys(req.query).find((k) => options.includes(k));
  if (!key) return null;
  const value = req.query[key];
  return { [key]: new RegExp(String(value), 'i') };
};
