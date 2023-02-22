import { NestFactory } from "@nestjs/core";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import * as session from "express-session";
import * as passport from "passport";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);

  app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 4 * 60 * 60 * 1000 }, // 4 Hours
      store: new PrismaSessionStore(prismaService, {
        checkPeriod: 2 * 60 * 1000, // ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }),
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    credentials: true,
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: "GET, PUT, POST, DELETE",
    allowedHeaders: "Content-Type, Authorization",
  });

  await prismaService.enableShutdownHooks(app);
  await app.listen(3000);
}
bootstrap();
