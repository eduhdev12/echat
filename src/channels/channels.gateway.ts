import { ConsoleLogger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { PrismaService } from "src/prisma.service";

@WebSocketGateway({
  cors: { origin: "http://localhost:5173" },
})
export class ChannelsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;
  private readonly logger = new ConsoleLogger(ChannelsGateway.name);

  constructor(private prisma: PrismaService) {}

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.warn("CLient connected");
    console.log(client);
    const isPostman = client.handshake.query.postman === "true";

    if(!client.handshake.headers["token"]) return client.disconnect();

    const parsedToken = (client.handshake.headers["token"] as string).match(
      /s%3A([^/]+)\./
    )?.[1];
    console.log("Parsed token", parsedToken);
    client.data.token = parsedToken;
  }

  @SubscribeMessage("joinRoom")
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() channelId: string
  ): Promise<string> {
    console.log("client joined room", client.data.token);
    client.join("1");

    return "Hello world!";
  }

  @SubscribeMessage("trigger")
  triggerMessage(@ConnectedSocket() client: Socket, payload: any) {
    this.server.to("1").emit("newMessage", "testmsg123");
  }
}
