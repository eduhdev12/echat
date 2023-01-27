import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
  constructor(private authService: AuthService) {
    super({
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    // We will register the user and validate it after
    if (req.url === "/auth/register") {
      await this.authService.register(email, password);
    }
    const user = await this.authService.validateUser(email, password);
    const authToken = await this.authService.login({ email, password });
    if (!user || !authToken) {
      throw new UnauthorizedException();
    }

    return { ...user, token: authToken.access_token };
  }
}
