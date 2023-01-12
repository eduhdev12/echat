import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService) {}

  async getAllUsers() {
    return await this.userService.find({ id: 1 });
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
