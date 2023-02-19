import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { PrismaService } from "src/prisma.service";

@WebSocketGateway({
  cors: { origin: "http://localhost:5173" },
})
export class ChannelsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  @SubscribeMessage("joinRoom")
  async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() channelId: string): Promise<string> {
    console.log("client joined room")
    client.join("1")
    
    return "Hello world!";
  }

  @SubscribeMessage("trigger")
  triggerMessage(@ConnectedSocket() client: Socket, payload: any) {
    this.server.to("1").emit("newMessage", "testmsg123");
  }
}
