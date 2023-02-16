import { User } from "@prisma/client";

export interface LoggedReq extends Record<string, any> {
  user: {
    userId: string;
    email: string;
    data: User;
  };
}
