import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";

interface User {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async getAllUsers() {
    return await this.userService.find({ id: 1 });
  }

  async login(user: User) {
    await this.validateUser(user.email, user.password); // We need to make sure that user exists

    const payload = { email: user.email, password: user.password };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string) {
    return await this.userService.createUser(email, password);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.find({ email });
    if (user && user.hashedPassword === password) {
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }
}
