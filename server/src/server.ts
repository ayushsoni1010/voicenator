import "dotenv/config";
import http from "http";
import app from "./app";
import SocketService from "./services/websocket.service";

const server = http.createServer(app);

// Initialize socket service
const socketService = new SocketService(server);
socketService.init();

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
