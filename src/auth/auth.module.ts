import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { SessionSerializer } from "./session.serializer";
import { APP_GUARD } from "@nestjs/core";
import { RolesGuard } from "./guards/roles.guard";

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthModule,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    SessionSerializer,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
  exports: [AuthService],
})
export class AuthModule {}
