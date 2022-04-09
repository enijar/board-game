import type { Request, Response } from "express";

export default async function ping(req: Request, res: Response) {
  res.send("pong");
}
