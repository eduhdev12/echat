import { ConsoleLogger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { PrismaService } from "src/prisma.service";

@WebSocketGateway({
  cors: { origin: ["http://localhost:5173", "http://localhost:4173"] },
})
export class ChannelsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private readonly logger = new ConsoleLogger(ChannelsGateway.name);

  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    try {
      const isPostman = client.handshake.query.postman === "true";
      const userToken = isPostman
        ? client.handshake.headers.token
        : client.handshake.auth.token;
      if (!userToken || !this.jwtService.verify(userToken))
        return client.disconnect();

      let decodedData: any = this.jwtService.decode(userToken);
      if (!decodedData || !decodedData.email) return client.disconnect();
      
      let userData = await this.prisma.user.findFirst({
        where: { email: decodedData.email },
        select: {
          id: true,
          avatar: true,
          email: true,
          role: true,
          username: true,
        },
      });
      if (!userData) return client.disconnect();

      client.data = userData;

      this.logger.log(
        `Client email=${decodedData.email}, id=${client.data.userId} connected!`
      );
    } catch (error) {
      client.disconnect();
      this.logger.error("Error while connecting to the socket", error);
    }
  }

  @SubscribeMessage("joinRoom")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string
  ): Promise<string> {
    this.logger.log(`Client id=${client.data.userId} joined room 1`);
    client.join("1");

    return "Hello world!";
  }

  @SubscribeMessage("trigger")
  triggerMessage(@ConnectedSocket() client: Socket, payload: any) {
    this.server
      .to("1")
      .emit(
        "newMessage",
        { text: randomUUID(), createdAt: Date.now() },
        client.data
      );
  }
}
