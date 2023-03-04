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
import * as crypto from "crypto";
import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { PrismaService } from "src/prisma.service";
import { MessageCreate } from "./channel.types";

@WebSocketGateway({
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      process.env.CLIENT_ENDPOINT,
    ],
  },
})
export class ChannelsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private readonly logger = new ConsoleLogger(ChannelsGateway.name);

  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private users = new Map();
  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    try {
      const isPostman = client.handshake.query.postman === "true";
      const userToken = isPostman
        ? client.handshake.headers.token
        : client.handshake.auth.token;
      const userPublicKey = isPostman
        ? client.handshake.headers.publicKey
        : client.handshake.auth.publicKey;
      if (!userToken || !userPublicKey || !this.jwtService.verify(userToken))
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

      // Encryption system part
      const ecdh = crypto.createECDH("secp256k1");
      const serverKey = ecdh.generateKeys("base64");
      const sharedKey = ecdh.computeSecret(userPublicKey, "base64", "base64");

      // @ts-ignore: We will add type support later
      userData.sharedKey = sharedKey;
      client.data = userData;

      client.emit("publicKey", serverKey, userPublicKey, sharedKey);

      this.logger.log(
        `Client email=${decodedData.email}, id=${client.data.id} connected!`
      );
    } catch (error) {
      client.disconnect();
      this.logger.error("Error while connecting to the socket", error);
    }
  }

  @SubscribeMessage("joinRoom")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: number
  ): Promise<string> {
    if (client.data.room === channelId) return;
    if (client.data.room) {
      client.leave(client.data.room);
    }

    let newMessages = await this.prisma.message.findMany({
      where: { channelId: channelId },
      include: {
        sender: {
          select: {
            id: true,
            avatar: true,
            email: true,
            role: true,
            username: true,
          },
        },
      },
    });
    client.emit("setMessages", newMessages);

    this.logger.log(`Client id=${client.data.id} joined room ${channelId}`);
    client.data.room = channelId.toString();
    client.join(channelId.toString());
    client.emit("joinRoom", channelId.toString());
  }

  @SubscribeMessage("messageCreate")
  async triggerMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: MessageCreate
  ) {
    if (!client.data.room) return;

    let newMessage = await this.prisma.message.create({
      data: {
        id: randomUUID(),
        content: payload.content,
        channel: { connect: { id: parseInt(client.data.room) } },
        sender: { connect: { id: client.data.id } },
      },
    });

    this.server
      .to(client.data.room)
      .emit(
        "messageCreate",
        { text: newMessage.content, createdAt: newMessage.createdAt },
        client.data
      );
  }
}
