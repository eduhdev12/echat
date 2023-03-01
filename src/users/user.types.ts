import { User } from "@prisma/client";
import { Request } from "express";

export interface LoggedReq extends Request { // Record<string, any>
  user?: {
    userId: string;
    email: string;
    data: User;
  };
}
