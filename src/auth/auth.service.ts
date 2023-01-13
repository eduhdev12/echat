import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "@prisma/client";
import { UsersService } from "src/users/users.service";

interface UserData {
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

  async login(user: UserData) {
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
    const user = await this.userService.findByEmail(email);
    if (user && user.hashedPassword === password) {
      const { hashedPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async verifyPayload(payload: any): Promise<User> {
    let user: User;

    try {
      user = await this.userService.findByEmail(payload.email);
    } catch (error) {
      throw new UnauthorizedException(
        `There isn't any user with email: ${payload.email}`
      );
    }
    delete user.hashedPassword;

    return user;
  }
}
