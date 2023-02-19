import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Socket } from "socket.io";
import { Server } from "ws";

@WebSocketGateway({
  cors: { origin: "http://localhost:5173" },
})
export class ChannelsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("message")
  handleMessage(@ConnectedSocket() client: Socket, payload: any): string {
    return "Hello world!";
  }
}
