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
import * as crypto from "crypto";
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
      // const dh = crypto.createECDH("secp256k1");
      // const publicKey = dh.generateKeys('hex');

      // const publicKey = dh.getPublicKey().toString("base64"); // Correct one
      // const sharedKey = dh.computeSecret(publicKey, "base64", "hex");
      // const dh = crypto.createDiffieHellman(512);
      // const publicKey = dh.generateKeys();

      // client.data.publicKey = publicKey;

      // client.emit("publicKey", publicKey);

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
        `Client email=${decodedData.email}, id=${client.data.id} connected!`
      );
    } catch (error) {
      client.disconnect();
      this.logger.error("Error while connecting to the socket", error);
    }
  }

  @SubscribeMessage("publicKey")
  async onPublicKey(
    @ConnectedSocket() client: Socket,
    @MessageBody() clientKey: any
  ) {
    // this.logger.log(publicKey);
    const ecdh = crypto.createECDH("secp256k1");

    let publicKeyy = ecdh.generateKeys("base64");
    this.logger.log("client key", clientKey);
    this.logger.log("publiccckeyyy", publicKeyy);
    // let publicKeyy = ecdh.getPublicKey("base64");

    let sharedKey = ecdh.computeSecret(clientKey, "base64", "base64");

    // const sharedSecret = crypto.createECDH('secp256k1').computeSecret(publicKey, 'base64', 'hex');
    this.users.set(client.id, sharedKey);
    this.server.emit("publicKey", publicKeyy, clientKey, sharedKey);
    this.logger.log("Emitted publicKey", publicKeyy);
    // this.server.emit('users', Array.from(this.users.values()));
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
