import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthModule],
})
export class AuthModule {}
