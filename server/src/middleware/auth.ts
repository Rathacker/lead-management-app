import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma";

export interface AuthedRequest extends Request {
  userId?: string;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = header.slice("Bearer ".length);
  let payload: { sub: string };
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string };
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // Reject tokens whose user no longer exists (e.g. after a database reset),
  // so the client cleanly re-authenticates instead of hitting integrity errors.
  const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true } });
  if (!user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.userId = user.id;
  next();
}
